import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getAssetAction} from "../../../actions/assets";
import {Link} from 'react-router-dom';
import {Form, Text, Radio, RadioGroup, TextArea, Checkbox} from "react-form";
import crypto from '../../../helpers/crypto/crypto'
import InfoBox from '../../components/info-box';
import {buyAssetAction} from "../../../actions/assets";
import {sellAssetAction} from "../../../actions/assets";
import {setAlert, setBodyModalParamsAction} from "../../../modules/modals";
import classNames from "classnames";
import {getAskOrders, getBidOrders} from "../../../actions/marketplace";
import uuid from "uuid";
import DeleteItem from "../delete-history/deletes";
import TradeHistoryItem from "../trade-history/trade-history-item";
import {getTransactionAction} from "../../../actions/transactions";
import OrderItem from "./order/index";
import {BlockUpdater} from "../../block-subscriber";
import {NotificationManager} from "react-notifications";

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
        BlockUpdater.on("data", this.listener);
    }

    componentWillUnmount() {
        BlockUpdater.removeListener("data", this.listener)
    }

    componentWillReceiveProps(newState) {
        this.getAsset(newState.match.params.asset);
        this.getAssets();
    }

    async getAsset(assetID) {
        const asset = await this.props.getAssetAction({asset: assetID});

        if (asset) {
            this.setState({
                ...this.props,
                asset: asset,
            });
            const bidOrders = await this.props.getBidOrders(asset.asset);
            const askOrders = await this.props.getAskOrders(asset.asset);
            this.setState({
                askOrders: askOrders.askOrders,
                bidOrders: bidOrders.bidOrders,
            })

        }
    }
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
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);
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
        if (!isPassphrase) {
            this.setState({
                ...this.props,
                passphraseStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                passphraseStatus: false
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

        values.publicKey = await crypto.getPublicKey(values.secretPhrase);
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
                            <div className="col-md-4 p-0">
                                <div className="card card-full-screen no-padding scroll">
                                    {
                                        this.state.assets &&
                                        this.state.assets.map((el, index) => {
                                            return (
                                                <Link
                                                    key={uuid()}
                                                    style={{display: 'block'}}
                                                    to={"/asset-exchange/" + (el ? el.asset : "")}
                                                    className={classNames({
                                                        "chat-item": true,
                                                        "active": this.state.asset.asset === (el ? el.asset : "")
                                                    })}
                                                >
                                                    <div className="chat-box-item">
                                                        <div className="chat-box-rs">
                                                            {el ? el.name : ""}
                                                        </div>
                                                        <div className="chat-date">
                                                            Quantity:&nbsp;{el ? el.initialQuantityATU : 0 * Math.pow(10, el ? el.decimals : 0)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            {
                                this.props.match.params &&
                                <div className="col-md-8 p-0">
                                    <div className="row">
                                        <div className="col-xl-6 col-md-12 pr-0">
                                            <div className="card header ballance card-tiny medium-padding">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="card-title medium">{this.state.asset.name}</div>
                                                    </div>
                                                    <div className="col-md-6 flex">
                                                        <div
                                                            className="card-title small">{this.state.asset.description}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{height: 'auto'}}
                                                 className="card ballance card-medium medium-padding full-height">
                                                <div className="form-group-app">
                                                    <div className="form-title">
                                                        <p>Buy {this.state.asset.name}</p>
                                                        <div className="form-sub-title">
                                                            balance: <strong>{this.props.amountATM} ATM</strong>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="form-group row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                                <label>Quantity</label>
                                                            </div>
                                                            <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                <input
                                                                    ref="quantity1"
                                                                    placeholder='Quantity'
                                                                    type={'number'}
                                                                    className={"form-control"}
                                                                />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text" id="amountText">{this.state.asset.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="form-group row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                                <label>Price</label>
                                                            </div>
                                                            <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                <input
                                                                    ref="priceATM1"
                                                                    type={'number'}
                                                                    placeholder='Quantity'
                                                                    className={"form-control"}
                                                                />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text" id="amountText">{this.state.asset.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="form-group row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                                <label>Total</label>
                                                            </div>
                                                            <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                <input
                                                                    ref="total1"
                                                                    type={'number'}
                                                                    placeholder='Price'
                                                                    className={"form-control"}
                                                                />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text" id="amountText">{this.state.asset.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                            </div>
                                                            <div className="col-md-9 pr-0">
                                                                <a
                                                                    onClick={() => {
                                                                        if (!this.refs.quantity1.value) {
                                                                            NotificationManager.error('Fill the quantity field', 'Unable to buy asset ' + this.state.asset.name, 5000);
                                                                            return;
                                                                        }
                                                                        if (!this.refs.priceATM1.value) {
                                                                            NotificationManager.error('Fill the price field', 'Unable to buy asset ' + this.state.asset.name, 5000);
                                                                            return;
                                                                        }
                                                                        if (!this.refs.total1.value) {
                                                                            NotificationManager.error('Fill the total field', 'Unable to buy asset ' + this.state.asset.name, 5000);
                                                                            return;
                                                                        }

                                                                        this.props.setBodyModalParamsAction('BUY_ASSET', {
                                                                            quantityATU: this.refs.quantity1.value,
                                                                            priceATM: this.refs.priceATM1.value,
                                                                            total: this.refs.total1.value,
                                                                            assetInfo: this.state.asset
                                                                        })
                                                                    }}
                                                                    className={classNames({
                                                                        "btn": true,
                                                                        "static": true,
                                                                        "blue": true,
                                                                        "blue-disabled": false
                                                                    })}
                                                                >
                                                                    Buy (APL > {this.state.asset.name})
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card ballance card-tiny medium-padding">
                                                <div className="form-group-app">
                                                    <div className="form-title">
                                                        <p>Offers to buy {this.state.asset.name}</p>
                                                    </div>
                                                    {this.state.askOrders.length === 0 ? <div className="info-box simple">
                                                            <p>No buy offers for this asset.</p>
                                                        </div>:
                                                        <div className="transaction-table">
                                                            <div className="transaction-table-body">
                                                                <table>
                                                                    <thead key={uuid()}>
                                                                    <tr>
                                                                        <td className="align-left">Asset</td>
                                                                        <td>Quantity</td>
                                                                        <td className="align-left">Price</td>
                                                                        <td className="align-right">Total</td>
                                                                        <td className="align-right">Cancel</td>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody key={uuid()}>
                                                                    {this.state.askOrders.length > 0 ?
                                                                        this.state.askOrders.map(el => {
                                                                            return (
                                                                                <OrderItem
                                                                                    key={uuid()}
                                                                                    order={el}
                                                                                />
                                                                            )
                                                                        }) : <p>No delete history</p>
                                                                    }
                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        </div>}
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-xl-6 col-md-12 pr-0">
                                            <div className="card header assets card-tiny medium-padding">
                                                <div className="full-box full">
                                                    <div className="full-box-item">
                                                        <div className='box'>
                                                            <div className="card-title bold small">Account:</div>
                                                            <div
                                                                className="card-title description small">{this.state.asset.accountRS}</div>
                                                        </div>
                                                        <div className='box'>
                                                            <div className="card-title bold small">Asset ID:</div>
                                                            <div
                                                                className="card-title asset-id description small">{this.state.asset.account}</div>
                                                        </div>
                                                    </div>
                                                    <div className="full-box-item">
                                                        <div className='box'>
                                                            <div className="card-title bold small">Quantity:</div>
                                                            <div
                                                                className="card-title description small">{this.state.asset.quantityATU}</div>
                                                        </div>
                                                        <div className='box'>
                                                            <div
                                                                className="card-title bold small">{this.state.asset.decimals}</div>
                                                            <div className="card-title description small">2</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{height: 'auto'}}
                                                 className="card assets card-medium medium-padding full-height">
                                                <div className="form-group-app">
                                                    <div className="form-title">
                                                        <p>Sell {this.state.asset.name}</p>
                                                        <div className="form-sub-title">
                                                            balance: <strong>{this.props.amountATM} ATM</strong>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="form-group row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                                <label>Quantity</label>
                                                            </div>
                                                            <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                <input
                                                                    ref="quantity2"
                                                                    type={'number'}
                                                                    placeholder='Quantity'
                                                                    className={"form-control"}
                                                                />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text" id="amountText">{this.state.asset.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="form-group row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                                <label>Price</label>
                                                            </div>
                                                            <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                <input
                                                                    ref="priceATM2"
                                                                    type={'number'}
                                                                    placeholder='Quantity'
                                                                    className={"form-control"}
                                                                />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text" id="amountText">{this.state.asset.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="form-group row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                                <label>Total</label>
                                                            </div>
                                                            <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                <input
                                                                    ref="total2"
                                                                    type={'number'}
                                                                    placeholder='Price'
                                                                    className={"form-control"}
                                                                />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text" id="amountText">{this.state.asset.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="input-group-app offset-top display-block inline no-margin">
                                                        <div className="row form-group-white">
                                                            <div className="col-md-3 pl-0">
                                                            </div>
                                                            <div className="col-md-9 pr-0">
                                                                <a
                                                                    onClick={() => {
                                                                        if (!this.refs.quantity2.value) {
                                                                            NotificationManager.error('Fill the quantity field', 'Unable to sell asset ' + this.state.asset.name, 5000);
                                                                            return;
                                                                        }
                                                                        if (!this.refs.priceATM2.value) {
                                                                            NotificationManager.error('Fill the price field', 'Unable to sell asset ' + this.state.asset.name, 5000);
                                                                            return;
                                                                        }
                                                                        if (!this.refs.total2.value) {
                                                                            NotificationManager.error('Fill the total field', 'Unable to sell asset ' + this.state.asset.name, 5000);
                                                                            return;
                                                                        }

                                                                        this.props.setBodyModalParamsAction('SELL_ASSET', {
                                                                            quantityATU: this.refs.quantity2.value,
                                                                            priceATM: this.refs.priceATM2.value,
                                                                            total: this.refs.total2.value,
                                                                            assetInfo: this.state.asset
                                                                        })
                                                                    }}
                                                                    className={classNames({
                                                                        "btn": true,
                                                                        "static": true,
                                                                        "blue": true,
                                                                        "blue-disabled": false
                                                                    })}
                                                                >
                                                                    Sell ({this.state.asset.name} > APL)
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card assets card-tiny medium-padding">
                                                <div className="form-group-app">
                                                    {this.state.bidOrders.length === 0 ? <div className="form-title">
                                                            <p>Offers to sell {this.state.asset.name}</p>
                                                        </div> :
                                                        <div className="transaction-table">
                                                            <div className="transaction-table-body">
                                                                <table>
                                                                    <thead key={uuid()}>
                                                                    <tr>
                                                                        <td className="align-left">Asset</td>
                                                                        <td>Quantity</td>
                                                                        <td className="align-left">Price</td>
                                                                        <td className="align-right">Total</td>
                                                                        <td className="align-right">Cancel</td>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody key={uuid()}>
                                                                    {this.state.bidOrders.length > 0 ?
                                                                        this.state.bidOrders.map(el => {
                                                                            return (
                                                                                <OrderItem
                                                                                    key={uuid()}
                                                                                    order={el}
                                                                                />
                                                                            )
                                                                        }) : <p>No delete history</p>
                                                                    }
                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        </div>}

                                                    <div className="info-box simple">
                                                        <p>No buy offersfor this aaset.</p>
                                                    </div>
                                                </div>
                                            </div>
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
                            <div className="col-md-4 p-0">
                                <div className="card card-full-screen no-padding scroll">
                                    {
                                        this.state.assets &&
                                        this.state.assets.map((el, index) => {
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
                                                            Quantity:&nbsp;{el ? el.initialQuantityATU : 0 * Math.pow(10, el ? el.decimals : 0)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
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
    amountATM: state.account.amountATM,
    assetBalances: state.account.assetBalances
});

const mapDispatchToProps = dispatch => ({
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
    buyAssetAction: (requestParams) => dispatch(buyAssetAction(requestParams)),
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    sellAssetAction: (requestParams) => dispatch(sellAssetAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),

    getAskOrders: asset => getAskOrders(asset),
    getBidOrders: asset => getBidOrders(asset),
});


export default connect(mapStateToProps, mapDispatchToProps)(AssetExchange);