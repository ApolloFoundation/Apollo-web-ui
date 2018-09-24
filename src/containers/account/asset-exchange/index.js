import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getAssetAction} from "../../../actions/assets";
import {Link} from 'react-router-dom';
import {Form, Text, Radio, RadioGroup, TextArea, Checkbox} from "react-form";
import crypto from '../../../helpers/crypto/crypto'
import InfoBox from '../../components/info-box';
import {buyAssetAction} from "../../../actions/assets";
import {sellAssetAction, getSpecificAccountAssetsAction} from "../../../actions/assets";
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
        const asset = await this.props.getAssetAction({asset: assetID});

        if (asset) {
            this.setState({
                ...this.props,
                asset: asset,
            });
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
            const assetsInfo    = assets.assets;



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
            const  orders = buyOrders.orders;

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
            const  orders = buyOrders.orders;

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
            setValue('total', values.quantity * values.priceATM);
        } else {
            setValue('total', 0);
        }
    };



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
                            <div className="col-md-3 p-0">
                                <div className="card card-full-screen no-padding scroll">
                                    {
                                        this.state.accountAssets &&
                                        this.state.accountAssets.map((el, index) => {
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
                                                            Quantity:&nbsp;{(el.quantityATU / Math.pow(10, el.decimals)).toFixed(el.decimals)}
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
                                <div className="col-md-9 p-0">
                                    <div className="row">
                                        <div className="col-xl-6 col-md-12 pr-0">
                                            <div className="card header ballance card-tiny medium-padding">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="card-title medium">{this.state.asset.name}</div>
                                                    </div>
                                                    <div className="col-md-6 flex">
                                                        <div
                                                            className="card-title small break-word">{this.state.asset.description}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Form
                                                onSubmit={(values) => this.handleBuyOrders(values)}
                                                render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (

                                                    <form style={{height: 'auto'}} className="card ballance card-medium medium-padding full-height" onSubmit={submitForm}>
                                                        <div className="form-group-app">
                                                            <div className="form-title">
                                                                <p>Buy {this.state.asset.name}</p>
                                                                <div className="form-sub-title">
                                                                    balance: <strong>{this.props.amountATM / 100000000} ATM</strong>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="input-group-app offset-top display-block inline no-margin">
                                                                <div className="form-group row form-group-white">
                                                                    <div className="col-md-3 pl-0">
                                                                        <label>Quantity</label>
                                                                    </div>
                                                                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                        <Text
                                                                            field="quantity"
                                                                            placeholder='Quantity'
                                                                            type={'number'}
                                                                            className={"form-control"}
                                                                            onMouseUp={() => this.handleTotalValue(setValue, getFormState)}
                                                                            onKeyUp={() => this.handleTotalValue(setValue, getFormState)}
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
                                                                        <Text
                                                                            field="priceATM"
                                                                            type={'number'}
                                                                            placeholder='Quantity'
                                                                            className={"form-control"}
                                                                            onMouseUp={() => this.handleTotalValue(setValue, getFormState)}
                                                                            onKeyUp={() => this.handleTotalValue(setValue, getFormState)}
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
                                                                        <Text
                                                                            field="total"
                                                                            type={'number'}
                                                                            placeholder='Price'
                                                                            className={"form-control"}
                                                                            readOnly
                                                                            disabled
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
                                                                        <button
                                                                            className={classNames({
                                                                                "btn": true,
                                                                                "static": true,
                                                                                "blue": true,
                                                                                "blue-disabled": !(!!getFormState().values.total)
                                                                            })}
                                                                        >
                                                                            Buy (APL > {this.state.asset.name})
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>

                                                )}
                                            />


                                            <div className="card ballance card-tiny medium-padding" style={{marginBottom: 0}}>
                                                <div className="form-group-app">
                                                    <div className="form-title">
                                                        <p>Offers to sell {this.state.asset.name}</p>
                                                    </div>
                                                    {
                                                        this.state.askOrders &&
                                                        this.state.askOrders.length === 0 ? <div className="info-box simple">
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
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody key={uuid()}>
                                                                    {
                                                                        this.state.askOrders &&
                                                                        this.state.askOrders.length > 0 ?
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
                                                            <div className="card-title bold small">Total available:</div>
                                                            <div
                                                                className="card-title description small"
                                                            >
                                                                {/*(el.quantityATU / Math.pow(10, el.decimals)).toFixed(el.decimals)*/}
                                                                {(this.state.asset.quantityATU / Math.pow(10, this.state.asset.decimals)).toFixed(this.state.asset.decimals)}
                                                            </div>
                                                        </div>
                                                        <div className='box'>
                                                            <div
                                                                className="card-title bold small">Asset decimals</div>
                                                            <div className="card-title description small">{this.state.asset.decimals}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Form
                                                onSubmit={(values) => this.handleSellOrders(values)}
                                                render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (

                                                    <form style={{height: 'auto'}} className="card ballance card-medium medium-padding full-height" onSubmit={submitForm}>
                                                        <div className="form-group-app">
                                                            <div className="form-title">
                                                                <p>Sell {this.state.asset.name}</p>
                                                                <div className="form-sub-title">
                                                                    balance: <strong>{this.state.asset.quantityATU / this.state.asset.decimals} {this.state.asset.name}</strong>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="input-group-app offset-top display-block inline no-margin">
                                                                <div className="form-group row form-group-white">
                                                                    <div className="col-md-3 pl-0">
                                                                        <label>Quantity</label>
                                                                    </div>
                                                                    <div className="col-md-9 pr-0 input-group input-group-text-transparent">
                                                                        <Text
                                                                            field="quantity"
                                                                            placeholder='Quantity'
                                                                            type={'number'}
                                                                            className={"form-control"}
                                                                            onMouseUp={() => this.handleTotalValue(setValue, getFormState)}
                                                                            onKeyUp={() => this.handleTotalValue(setValue, getFormState)}
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
                                                                        <Text
                                                                            field="priceATM"
                                                                            type={'number'}
                                                                            placeholder='Quantity'
                                                                            className={"form-control"}
                                                                            onMouseUp={() => this.handleTotalValue(setValue, getFormState)}
                                                                            onKeyUp={() => this.handleTotalValue(setValue, getFormState)}
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
                                                                        <Text
                                                                            field="total"
                                                                            type={'number'}
                                                                            placeholder='Price'
                                                                            className={"form-control"}
                                                                            readOnly
                                                                            disabled
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
                                                                        <button
                                                                            className={classNames({
                                                                                "btn": true,
                                                                                "static": true,
                                                                                "blue": true,
                                                                                "blue-disabled": !(!!getFormState().values.total)
                                                                            })}
                                                                        >
                                                                            Sell (APL > {this.state.asset.name})
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>

                                                )}
                                            />

                                            <div className="card assets card-tiny medium-padding" style={{marginBottom: 0}}>
                                                <div className="form-group-app">
                                                    <div className="form-title">
                                                        <p>Offers to buy {this.state.asset.name}</p>
                                                    </div>
                                                    {
                                                        this.state.bidOrders &&
                                                        this.state.bidOrders.length === 0 ?  <div className="info-box simple">
                                                                <p>No buy offersfor this aaset.</p>
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
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody key={uuid()}>
                                                                    {
                                                                        this.state.bidOrders &&
                                                                        this.state.bidOrders.length > 0 ?
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
                                                        </div>
                                                    }

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
                            <div className="col-md-3 p-0">
                                <div className="card card-full-screen no-padding scroll">
                                    {
                                        this.state.accountAssets &&
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
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    getTransactionAction: (requestParams) => dispatch(getTransactionAction(requestParams)),

    getAccountAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams)),
    getAskOrders: asset => getAskOrders(asset),
    getBidOrders: asset => getBidOrders(asset),
});


export default connect(mapStateToProps, mapDispatchToProps)(AssetExchange);