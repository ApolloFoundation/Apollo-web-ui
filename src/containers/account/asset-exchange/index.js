/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getAssetAction} from "../../../actions/assets";
import {Link} from 'react-router-dom';
import {Form, Text, Radio, RadioGroup, TextArea, Checkbox} from "react-form";
import crypto from '../../../helpers/crypto/crypto'
import InputForm from '../../components/input-form';
import {buyAssetAction} from "../../../actions/assets";
import {sellAssetAction, getSpecificAccountAssetsAction} from "../../../actions/assets";
import {setAlert, setBodyModalParamsAction} from "../../../modules/modals";
import classNames from "classnames";
import {getAskOrders, getBidOrders} from "../../../actions/marketplace";
import uuid from "uuid";
import InfoBox from '../../components/info-box';
import DeleteItem from "../delete-history/deletes";
import TradeHistoryItem from "../trade-history/trade-history-item";
import {getTransactionAction} from "../../../actions/transactions";
import OrderItem from "./order/index";
import {BlockUpdater} from "../../block-subscriber";
import {NotificationManager} from "react-notifications";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'
import bigInteger from 'big-integer'

import OffersToBuy from './offers-to-buy';
import OffersToSell from './offers-to-sell';

import BuyAsset from './buy-asset';
import SellAsset from './sell-asset';

import SidebatAsset from './sidebar-asset';
import SidebarContent from '../../components/sidebar-list';

class AssetExchange extends React.Component {
    constructor(props) {
        super(props);
        this.getAsset = this.getAsset.bind(this);
    }

    state = {
        asset: null,
        bidOrders: [],
        askOrders: [],
    };

    listener = data => {
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

    componentWillReceiveProps(newState) {
        this.getAsset(newState.match.params.asset);
        this.getAssets();
        this.getAccountAsset(newState);
    }

    async getAsset(assetID) {
        let asset = await this.props.getAssetAction({asset: assetID});
        
        this.setState({
            asset,
        });

        if (asset && this.props.assetBalances) {
            const assetBalance = this.props.assetBalances.find(item => {
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
    }

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

    handleBuyFormSubmit = async (values) => {
        if (!values.quantityATU) {
            this.setState({
                ...this.props,
                priceATMStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                priceATMStatus: false
            })
        }
        if (!values.feeATM) {
            this.setState({
                ...this.props,
                feeStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                feeStatus: false
            })
        }
        if (!values.priceATM) {
            this.setState({
                ...this.props,
                priceATMStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                priceATMStatus: false
            })
        }

        values.publicKey = await crypto.getPublicKeyAPL(values.secretPhrase);
        values.asset = this.state.asset.asset;
        values.deadline = '1440';
        values.asset_order_type = 'placeAskOrder';
        values.phasingHashedSecretAlgorithm = '2';
        values.priceATM = values.priceATM * Math.pow(10, 6);
        values.quantityATU = values.quantityATU * Math.pow(10, this.state.asset.decimals);
        values.feeATM = values.feeATM * Math.pow(10, 8);

        delete values.secretPhrase;
        this.props.buyAssetAction(values);
        this.props.setAlert('success', 'The buy order has been submitted.');
    };

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

    handleTotalValue = (setValue, getFormState) => {
        const {values} = getFormState();


        if (values.quantity && values.priceATM) {
            let result = (bigInteger(values.quantity).multiply(bigInteger(values.priceATM)));


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
    }

    render() {

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                />
                {
                    this.state.asset &&
                    <div className="page-body container-fluid assets-exchange">
                        <div className="row">
                            {
                                window.innerWidth > 768 &&
                                <div className="col-md-3 p-0 pb-3">
                                    <SidebarContent
                                        element={'asset'}
                                        baseUrl={'/asset-exchange/'}
                                        data={this.state.accountAssets}
                                        emptyMessage={'No followed polls.'}
                                        Component={SidebatAsset}
                                    />
                                </div>
                            }
                            {
                                this.props.match.params &&
                                <div className="col-md-9 p-0">
                                    <div className="row">
                                        {
                                            window.innerWidth < 768 &&
                                            <div className="col-xl-6 col-md-12 pr-0">
                                                <a onClick={this.goBack} className="btn primary mb-3">
                                                    <i class="zmdi zmdi-arrow-left" /> &nbsp;
                                                    Back to list
                                                </a>
                                            </div>
                                        }
                                        <div className={'col-xl-6 col-md-12 pr-0'}>
                                            <div className="card header ballance card-tiny medium-padding mb-3">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="card-title medium">{this.state.asset.name}</div>

                                                    </div>
                                                    <div className="col-md-6 flex">
                                                        <div
                                                            className="card-title small break-word">{this.state.asset.description}</div>
                                                    </div>
	                                                <div className="asset-btns-block">
		                                                <a
			                                                className={"btn static blue"}
			                                                onClick={() => {
				                                                this.props.setBodyModalParamsAction('VIEW_ASSET_DISTRIBUTION', {
					                                                asset: this.props.match.params.asset,
					                                                decimals: this.state.asset.decimals,
					                                                totalAvailable: this.state.asset.quantityATU
				                                                })
			                                                }}
		                                                >
			                                                View Account Distribution
		                                                </a>
		                                                <a
			                                                className={"btn static blue"}
			                                                onClick={() => {
				                                                this.props.setBodyModalParamsAction('VIEW_ASSET_DIVIDEND_HISTORY', {
					                                                asset: this.props.match.params.asset,
				                                                })
			                                                }}>
			                                                View Asset Dividend History
		                                                </a>
		                                                <br/>
		                                                {this.state.asset &&
		                                                this.state.asset.account === this.props.account ?
			                                                <a
				                                                className={"btn static blue"}
				                                                onClick={() => {
					                                                this.props.setBodyModalParamsAction('PAY_DIVIDENDS', {
						                                                asset: this.props.match.params.asset,
					                                                })
				                                                }}>
				                                                Pay Dividends
			                                                </a> : null
		                                                }
	                                                </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className={'col-xl-6 col-md-12 pr-0'}>
                                            <div className="card header assets card-tiny medium-padding mb-3">
                                                <div className="full-box full">
                                                    <div className="full-box-item">
                                                        <div className='box'>
                                                            <div className="card-title bold small">Account:</div>
                                                            <div
                                                                className="card-title description small"
                                                            >
                                                                {this.state.asset.accountRS}
                                                            </div>
                                                        </div>
                                                        <div className='box'>
                                                            <div className="card-title bold small">Asset ID:</div>
                                                            <div
                                                                className="card-title asset-id description small">{this.state.asset.asset}</div>
                                                        </div>
                                                    </div>
                                                    <div className="full-box-item">
                                                        <div className='box'>
                                                            <div className="card-title bold small">Total available:
                                                            </div>
                                                            <div
                                                                className="card-title description small"
                                                            >
                                                                {/*(el.quantityATU / Math.pow(10, el.decimals)).toFixed(el.decimals)*/}
                                                                {(this.state.asset.quantityATU / Math.pow(10, this.state.asset.decimals)).toFixed(this.state.asset.decimals)}
                                                            </div>
                                                        </div>
                                                        <div className='box'>
                                                            <div
                                                                className="card-title bold small">Asset decimals
                                                            </div>
                                                            <div
                                                                className="card-title description small">{this.state.asset.decimals}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={'row'}>
                                        <div className="col-xl-6 col-md-12 pr-0 pb-3">
                                            <BuyAsset asset={this.state.asset} handleTotalValue={this.handleTotalValue} handleBuyOrders={this.handleBuyOrders}/>
                                        </div>
                                        <div className="col-xl-6 col-md-12 pr-0 pb-3">
                                            <SellAsset asset={this.state.asset} handleTotalValue={this.handleTotalValue} handleSellOrders={this.handleSellOrders}/>
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
                                <div className="card card-full-screen no-padding scroll">
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
    getAskOrders: asset => getAskOrders(asset),
    getBidOrders: asset => getBidOrders(asset),
});


export default connect(mapStateToProps, mapDispatchToProps)(AssetExchange);