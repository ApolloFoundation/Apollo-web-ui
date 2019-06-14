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
import uuid from "uuid";
import InfoBox from '../../components/info-box';
import {getTransactionAction} from "../../../actions/transactions";
import {BlockUpdater} from "../../block-subscriber";
import bigInteger from 'big-integer'

import OffersToBuy from './offers-to-buy';
import OffersToSell from './offers-to-sell';

import BuyAsset from './buy-asset';
import SellAsset from './sell-asset';

import SidebatAsset from './sidebar-asset';
import SidebarContent from '../../components/sidebar-list';

class AssetExchange extends React.Component {
    state = {
        asset: null,
        assets: null,
        bidOrders: [],
        askOrders: [],
    };

    listener = data => {
        console.log('---assetId----', this.props.match.params)
        this.getAsset(this.props.match.params.asset);
        this.getAssets();
    };

    componentDidMount() {
        this.getAsset(this.props.match.params.asset);
        this.getAssets();
        this.getAccountAsset(this.props);
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.location.pathname !== prevProps.location.pathname ||
            (!this.props.match.params.asset && !this.state.asset && this.state.assets && this.state.assets.length > 0)) {
            const assetId = this.props.match.params.asset || this.state.assets[0].asset;
            this.getAsset(assetId);
            this.getAssets();
            this.getAccountAsset(this.props);
        }
    };

    getAsset = async (assetID) => {
        let asset = await this.props.getAssetAction({asset: assetID});

        this.setState({
            asset,
        });

        if (asset) {
            const assetBalance = this.props.assetBalances && this.props.assetBalances.find(item => {
                if (item) return item.asset === asset.asset;
            });
            asset.balanceATU = assetBalance ? assetBalance.balanceATU : 0;

            const bidOrders = await this.getBuyOrders(asset);
            const askOrders = await this.getSellOrders(asset);
            this.setState({
                askOrders: askOrders,
                bidOrders: bidOrders,
            })

        }
    };

    getAccountAsset = async (newState) => {
        const assets = await this.props.getAccountAssetAction({account: newState.account});

        if (assets) {

            const accountAssets = assets.accountAssets;
            const assetsInfo = assets.assets;


            const result = accountAssets.map((el, index) => {
                return {...(assetsInfo[index]), ...el}
            });

            this.setState({
                accountAssets: result,
            })
        }

    };

    getBuyOrders = async assetName => {

        const buyOrders = await this.props.getBidOrders(assetName.asset);
        if (buyOrders) {
            const assets = buyOrders.assets;
            const orders = buyOrders.orders;

            const result = assets.map((el, index) => {
                const asset = orders[index];
                return {...el, ...asset}
            });

            return result;
        }
    };

    getSellOrders = async assetName => {
        const buyOrders = await this.props.getAskOrders(assetName.asset);
        if (buyOrders) {
            const assets = buyOrders.assets;
            const orders = buyOrders.orders;

            const result = assets.map((el, index) => {
                const asset = orders[index];
                return {...el, ...asset}
            });

            return result;
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
        })
    };

    handleBuyOrders = async (values) => {
        this.props.setBodyModalParamsAction('BUY_ASSET', {
            quantityATU: values.quantity,
            priceATM: values.priceATM,
            total: values.total,
            assetInfo: this.state.asset
        })
    };

    handleTotalValue = (setValue, v1, v2) => {

        if (v1 && v2) {
            let result = (bigInteger(v1).multiply(bigInteger(v2)));


            if (result && Array.isArray(result.value)) {
                result = result.value.reverse().reduce((a, b) => {
                    return a.toString() + b.toString()
                })
            } else {
                result = result.value;
            }

            setValue('total', (result).toString());
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

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                >
                    {window.innerWidth < 768 && (
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
                            {
                                window.innerWidth > 767 &&
                                <div className="col-md-3 p-0 pb-3">
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
                                                    View Account Distribution
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <SidebarContent
                                        element={'asset'}
                                        baseUrl={'/asset-exchange/'}
                                        data={this.state.accountAssets}
                                        currentItem={this.state.asset.asset}
                                        emptyMessage={'No assets found.'}
                                        Component={SidebatAsset}
                                    />
                                </div>
                            }
                            {
                                this.props.match.params &&
                                <div className="col-md-9 p-0">
                                    <div className={'row'}>
                                        <div className="col-xl-6 col-md-12 pr-0 pb-3">
                                            <BuyAsset balanceATU={this.state.asset.balanceATU} asset={this.state.asset}
                                                      handleTotalValue={this.handleTotalValue}
                                                      handleBuyOrders={this.handleBuyOrders}/>
                                        </div>
                                        <div className="col-xl-6 col-md-12 pr-0 pb-3">
                                            <SellAsset asset={this.state.asset} handleTotalValue={this.handleTotalValue}
                                                       handleSellOrders={this.handleSellOrders}/>
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-xl-6 col-md-12 pr-0 pb-3'}>
                                            <OffersToBuy bidOrders={this.state.bidOrders} asset={this.state.asset}/>
                                        </div>
                                        <div className={'col-xl-6 col-md-12 pr-0 pb-3'}>
                                            <OffersToSell askOrders={this.state.askOrders} asset={this.state.asset}/>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
                {
                    !this.state.asset &&
                    <div className="page-body container-fluid assets-exchange">
                        <div className="row">
                            <div className="col-md-3 p-0 one-col pb-3">
                                <div className="card card-full-screen no-padding scroll justify-content-start">
                                    {
                                        this.state.accountAssets &&
                                        !!this.state.accountAssets.length &&
                                        this.state.accountAssets.map((el, index) => {
                                            return (
                                                <Link
                                                    key={uuid()}
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
    getAskOrders: asset => dispatch(getAskOrders(asset)),
    getBidOrders: asset => dispatch(getBidOrders(asset)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AssetExchange);
