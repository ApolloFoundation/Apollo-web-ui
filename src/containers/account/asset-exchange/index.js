/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {buyAssetAction, getAssetAction, getSpecificAccountAssetsAction, sellAssetAction} from "../../../actions/assets";
import {Link} from 'react-router-dom';
import crypto from '../../../helpers/crypto/crypto'
import {setAlert, setBodyModalParamsAction} from "../../../modules/modals";
import classNames from "classnames";
import {getAskOrders, getBidOrders} from "../../../actions/marketplace";
import InfoBox from '../../components/info-box';
import {getTransactionAction} from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";

import OffersToBuy from './offers-to-buy';
import OffersToSell from './offers-to-sell';

import BuyAsset from './buy-asset';
import SellAsset from './sell-asset';

import SidebatAsset from './sidebar-asset';
import SidebarList from '../../components/sidebar-list';

const bigInteger = require('jsbn').BigInteger;
const itemsPerPage = 5;

class AssetExchange extends React.Component {
    state = {
        asset: null,
        assets: null,
        buyOrders: [],
        sellOrders: [],
        pagination: {
            sell: {
                page: 1,
                firstIndex: 0,
                lastIndex: itemsPerPage,
            },
            buy: {
                page: 1,
                firstIndex: 0,
                lastIndex: itemsPerPage,
            },
        },
        buyForm: null,
        sellForm: null,
    };

    listener = data => {
        const assetId = this.props.match.params.asset || (this.state.assets && this.state.assets[0].asset);
        this.getAsset(assetId);
        this.getAssets();
    };

    componentDidMount() {
        this.getAsset(this.props.match.params.asset);
        this.getAssets();
        this.getAccountAsset(this.props);
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener);
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.location.pathname !== prevProps.location.pathname ||
            (!this.props.match.params.asset && !this.state.asset && this.state.assets && this.state.assets.length > 0)) {
            const assetId = this.props.match.params.asset || (this.state.assets && this.state.assets[0].asset);
            this.getAsset(assetId);
            this.getAssets();
            this.getAccountAsset(this.props);
            if (this.state.buyForm) this.state.buyForm.resetAll();
            if (this.state.sellForm) this.state.sellForm.resetAll();
        }
    };

    getAsset = async (assetID) => {
        let asset = await this.props.getAssetAction({asset: assetID});


        if (asset) {
            const assetBalance = this.props.assetBalances && this.props.assetBalances.find(item => {
                if (item) return item.asset === asset.asset;
            });
            asset.balanceATU = assetBalance ? assetBalance.balanceATU : 0;

            this.setState({
                asset,
            });

            this.getBuyOrders(asset);
            this.getSellOrders(asset);
        }
    };

    getAccountAsset = async (newState) => {
        const assets = await this.props.getAccountAssetAction({account: newState.account});

        if (assets) {
            const assetId = this.props.match.params.asset || (this.state.assets && this.state.assets[0].asset);
            const accountAsset = assets.accountAssets.find((el) => {
                return el.asset === assetId
            });

            this.setState({
                accountAsset,
                accountAssets: assets.accountAssets,
            })
        }

    };

    getBuyOrders = async (assetName, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.buy.firstIndex,
                lastIndex: this.state.pagination.buy.lastIndex,
            }
        }
        const buyOrders = await this.props.getBidOrders({
            asset: assetName.asset,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });
        if (buyOrders) {
            const assets = buyOrders.assets;
            const orders = buyOrders.orders;

            const result = assets.map((el, index) => {
                const asset = orders[index];
                return {...el, ...asset}
            });

            const newPagination = this.state.pagination;
            newPagination.buy = {
                ...newPagination.buy,
                ...pagination
            };

            this.setState({
                pagination: newPagination,
                buyOrders: result,
            });
        }
    };

    getSellOrders = async (assetName, pagination) => {
        if (!pagination) {
            pagination = {
                firstIndex: this.state.pagination.sell.firstIndex,
                lastIndex: this.state.pagination.sell.lastIndex,
            }
        }
        const sellOrders = await this.props.getAskOrders({
            asset: assetName.asset,
            firstIndex: pagination.firstIndex,
            lastIndex: pagination.lastIndex
        });
        if (sellOrders) {
            const assets = sellOrders.assets;
            const orders = sellOrders.orders;

            const result = assets.map((el, index) => {
                const asset = orders[index];
                return {...el, ...asset}
            });

            const newPagination = this.state.pagination;
            newPagination.sell = {
                ...newPagination.sell,
                ...pagination
            };

            this.setState({
                pagination: newPagination,
                sellOrders: result,
            });
        }
    };

    async getAssets() {
        if (this.props.assetBalances) {
            let assets = this.props.assetBalances.map(async (el, index) => {
                return this.props.getAssetAction({
                    asset: el ? el.asset : ""
                })
            });
            Promise.all(assets)
                .then((data) => {

                    this.setState({
                        ...this.props,
                        assets: data,
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    async getTransaction(data) {
        const reqParams = {
            transaction: data,
            account: this.props.account
        };

        const transaction = await this.props.getTransactionAction(reqParams);
        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction);
        }
    }

    handleSellOrders = async (values) => {
        this.props.setBodyModalParamsAction('SELL_ASSET', {
            quantityATU: values.quantity,
            priceATM: values.priceATM,
            total: values.total,
            assetInfo: this.state.asset
        });
        this.state.sellForm.resetAll();
    };

    handleBuyOrders = async (values) => {
        this.props.setBodyModalParamsAction('BUY_ASSET', {
            quantityATU: values.quantity,
            priceATM: values.priceATM,
            total: values.total,
            assetInfo: this.state.asset
        });
        this.state.buyForm.resetAll();
    };

    handleTotalValue = (setValue, v1, v2) => {

        if (v1 && v2) {
            let result = (new bigInteger(v1).multiply(new bigInteger(v2)));

            if (result && Array.isArray(result.value)) {
                result = result.value.reverse().reduce((a, b) => {
                    return a.toString() + b.toString()
                });
            } 

            setValue('total', result.toString());
        } else {
            setValue('total', 0);
        }
    };

    goBack = () => {
        this.setState({
            asset: null
        }, () => {
            this.props.history.push('/asset-exchange')
        });
    };

    onPaginate = (type, page) => {
        const pagination = {
            page: page,
            firstIndex: page * itemsPerPage - itemsPerPage,
            lastIndex: page * itemsPerPage
        };
        if (type === 'buy') {
            this.getBuyOrders(this.state.asset, pagination);
        } else if (type === 'sell') {
            this.getSellOrders(this.state.asset, pagination);
        }
    };

    getBuyFormApi = (form) => {
        this.setState({buyForm: form})
    };

    getSellFormApi = (form) => {
        this.setState({sellForm: form})
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                >
                    {this.state.asset && window.innerWidth < 768 && (
                        <button
                            type={'button'}
                            onClick={this.goBack} className="btn btn-default btn-sm">
                            <i className="zmdi zmdi-arrow-left"/> &nbsp;
                            Back to list
                        </button>
                    )}
                </SiteHeader>
                {
                    this.state.asset &&
                    <div className="page-body container-fluid assets-exchange">
                        <div className="row">
                            <div className="col-md-3 p-0">
                                <div className="card mb-3">
                                    <div className="card-title card-title-lg bg-primary">
                                        <span className={'title-lg'}>{this.state.asset.name}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className={'form-group-app'}>
                                            <div className={'wrap-info'}>
                                                <p className={'mb-3'}>
                                                    <label>
                                                        Total available:
                                                    </label>
                                                    <div>
                                                        {(this.state.asset.quantityATU / Math.pow(10, this.state.asset.decimals)).toFixed(this.state.asset.decimals)} {this.state.asset.name}
                                                    </div>
                                                </p>
                                                <p className={'mb-3'}>
                                                    <label>
                                                        Description:
                                                    </label>
                                                    <div>
                                                        {this.state.asset.description}
                                                    </div>
                                                </p>
                                                <p className={'mb-3'}>
                                                    <label>
                                                        Account:
                                                    </label>
                                                    <div>
                                                        {this.state.asset.accountRS}
                                                    </div>
                                                </p>
                                                <p className={'mb-3'}>
                                                    <label>
                                                        Asset ID:
                                                    </label>
                                                    <div>
                                                        {this.state.asset.asset}
                                                    </div>
                                                </p>
                                                <p>
                                                    <label>
                                                        Asset decimals:
                                                    </label>
                                                    <div>
                                                        {this.state.asset.decimals}
                                                    </div>
                                                </p>
                                            </div>
                                            <button
                                                type={'button'}
                                                className={"btn btn-default btn-lg"}
                                                onClick={() => {
                                                    this.props.setBodyModalParamsAction('VIEW_ASSET_DISTRIBUTION', {
                                                        asset: this.props.match.params.asset,
                                                        decimals: this.state.asset.decimals,
                                                        totalAvailable: this.state.asset.quantityATU
                                                    })
                                                }}
                                            >
                                                View Asset Distribution
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                this.props.match.params &&
                                <div className="col-md-9 p-0">
                                    <div className={'row'}>
                                        <div className="col-xl-6 col-md-12 pr-0 pb-3">
                                            <BuyAsset
                                                decimals={this.props.decimals}
                                                ticker={this.props.ticker}
                                                asset={this.state.asset}
                                                balanceATU={this.state.asset.balanceATU}
                                                handleTotalValue={this.handleTotalValue}
                                                handleBuyOrders={this.handleBuyOrders}
                                                getFormApi={this.getBuyFormApi}
                                            />
                                        </div>
                                        <div className="col-xl-6 col-md-12 pr-0 pb-3">
                                            <SellAsset
                                                asset={this.state.asset}
                                                ticker={this.props.ticker}
                                                accountAsset={this.state.accountAsset}
                                                handleTotalValue={this.handleTotalValue}
                                                handleSellOrders={this.handleSellOrders}
                                                getFormApi={this.getSellFormApi}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>
                        <div className="row">
                            {window.innerWidth > 767 && (
                                <div className="col-md-3 p-0 mb-3">
                                    <SidebarList
                                        element={'asset'}
                                        baseUrl={'/asset-exchange/'}
                                        data={this.state.accountAssets}
                                        currentItem={this.state.asset.asset}
                                        emptyMessage={'No assets found.'}
                                        Component={SidebatAsset}
                                    />
                                </div>
                            )}
                            {this.props.match.params && (
                                <div className="col-md-9 p-0">
                                    <div className={'row'}>
                                        <div className={'col-xl-6 col-md-12 pr-0 pb-3'}>
                                            <OffersToBuy
                                                buyOrders={this.state.buyOrders}
                                                asset={this.state.asset}
                                                page={this.state.pagination.buy.page}
                                                onPaginate={this.onPaginate}
                                                itemsPerPage={itemsPerPage}
                                            />
                                        </div>
                                        <div className={'col-xl-6 col-md-12 pr-0 pb-3'}>
                                            <OffersToSell
                                                sellOrders={this.state.sellOrders}
                                                asset={this.state.asset}
                                                page={this.state.pagination.sell.page}
                                                onPaginate={this.onPaginate}
                                                itemsPerPage={itemsPerPage}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                }
                {
                    !this.state.asset &&
                    <div className="page-body container-fluid assets-exchange">
                        <div className="row">
                            <div className="col-md-3 p-0 one-col pb-3">
                                <div className="card card-full-screen no-padding scroll justify-content-start assets-exchange-not-selected">
                                    {
                                        this.state.accountAssets &&
                                        !!this.state.accountAssets.length &&
                                        this.state.accountAssets.map((el, index) => {
                                            return (
                                                <Link
                                                    style={{display: 'block'}}
                                                    to={"/asset-exchange/" + (el ? el.asset : "")}
                                                    className={classNames({
                                                        "chat-item": true,
                                                    })}
                                                >
                                                    <div className="chat-box-item">
                                                        <div className="chat-box-rs">
                                                            {el ? el.name : ""}
                                                        </div>
                                                        <div className="chat-date">
                                                            Quantity:&nbsp;{(el.quantityATU / Math.pow(10, el.decimals)).toFixed(el.decimals)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    }
                                    {
                                        this.state.accountAssets &&
                                        !(!!this.state.accountAssets.length) &&
                                        <InfoBox>No assets found.</InfoBox>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}


const mapStateToProps = state => ({
    amountATM: state.account.balanceATM,
    account: state.account.account,
    decimals: state.account.decimals,
    ticker: state.account.ticker,
    assetBalances: state.account.assetBalances
});

const mapDispatchToProps = dispatch => ({
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
    buyAssetAction: (requestParams) => dispatch(buyAssetAction(requestParams)),
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    sellAssetAction: (requestParams) => dispatch(sellAssetAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),

    getAccountAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams)),
    getAskOrders: requestParams => dispatch(getAskOrders(requestParams)),
    getBidOrders: requestParams => dispatch(getBidOrders(requestParams)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AssetExchange);
