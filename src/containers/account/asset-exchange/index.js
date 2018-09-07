import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getAssetAction} from "../../../actions/assets";
import {Link} from 'react-router-dom';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import crypto from '../../../helpers/crypto/crypto'
import InfoBox from '../../components/info-box';
import {buyAssetAction} from "../../../actions/assets";
import {sellAssetAction} from "../../../actions/assets";
import {setAlert, setBodyModalParamsAction} from "../../../modules/modals";
import classNames from "classnames";

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
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase))
});

class AssetExchange extends React.Component {
    constructor(props) {
        super(props);

        this.getAsset = this.getAsset.bind(this);
    }

    state = {
        asset: null
    };

    componentDidMount() {
        this.getAsset(this.props.match.params.asset);
        this.getAssets();
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
        values.priceATM =    values.priceATM  * Math.pow(10, 6);
        values.quantityATU = values.quantityATU  * Math.pow(10, this.state.asset.decimals);
        values.feeATM =      values.feeATM  * Math.pow(10, 8);

        delete values.secretPhrase;
        this.props.buyAssetAction(values);
        this.props.setAlert('success', 'The buy order has been submitted.');
    };

    async getAssets() {
        if (this.props.assetBalances) {
            let assets = this.props.assetBalances.map(async (el, index) => {
                return this.props.getAssetAction({
                    asset: el.asset
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

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                />
                {
                    this.state.asset &&
                    <div className="page-body container-fluid assets-exchange">

                        <div className="row">
                            <div className="col-md-4">
                                <div className="card card-full-screen no-padding scroll">
                                    {
                                        this.state.assets &&
                                        this.state.assets.map((el, index) => {
                                            return (
                                                <Link
                                                    style={{display: 'block'}}
                                                    to={"/asset-exchange/" + el.asset}
                                                    className={classNames({
                                                        "chat-item": true,
                                                        "active": this.state.asset.asset === el.asset
                                                    })}
                                                >
                                                    <div className="chat-box-item">
                                                        <div className="chat-box-rs">
                                                            {el.name}
                                                        </div>
                                                        <div className="chat-date">
                                                            Quantity:&nbsp;{el.initialQuantityATU * Math.pow(10, el.decimals)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    }

                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="card header ballance card-tiny medium-padding">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="card-title big">{this.state.asset.name}</div>
                                                    </div>
                                                    <div className="col-md-6 flex">
                                                        <div className="card-title align-middle">{this.state.asset.description}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{height: 'auto'}} className="card ballance card-medium medium-padding full-height">
                                            <div className="form-group-app">
                                                <div className="form-title">
                                                    <p>Buy {this.state.asset.name}</p>
                                                    <div className="form-sub-title">
                                                        balance: <strong>{this.props.amountATM} ATM</strong>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Quantity</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <input ref="quantity1" placeholder='Recipient' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Price</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <input ref="priceATM1" placeholder='Quantity' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Total</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <input ref="total1" placeholder='Price' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                        </div>
                                                        <div className="col-md-7">
                                                            <a
                                                                onClick={() => this.props.setBodyModalParamsAction('BUY_ASSET', {
                                                                    quantityATU: this.refs.quantity1.value,
                                                                    priceATM: this.refs.priceATM1.value,
                                                                    total: this.refs.total1.value,
                                                                    assetInfo: this.state.asset
                                                                })}
                                                                className="btn static blue"
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
                                                    <p>Offers to sell {this.state.asset.name}</p>
                                                </div>
                                                <div className="info-box simple">
                                                    <p>No buy offersfor this aaset.</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className="card header assets card-tiny medium-padding">
                                            <div className="full-box full">
                                                <div className="full-box-item">
                                                    <div className='box'>
                                                        <div className="card-title bold">Account:</div>
                                                        <div className="card-title description">{this.state.asset.accountRS}</div>
                                                    </div>
                                                    <div className='box'>
                                                        <div className="card-title bold">Asset ID:</div>
                                                        <div className="card-title description">{this.state.asset.account}</div>
                                                    </div>
                                                </div>
                                                <div className="full-box-item">
                                                    <div className='box'>
                                                        <div className="card-title bold">Quantity:</div>
                                                        <div className="card-title description">{this.state.asset.quantityATU}</div>
                                                    </div>
                                                    <div className='box'>
                                                        <div className="card-title bold">{this.state.asset.decimals}</div>
                                                        <div className="card-title description">2</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div  style={{height: 'auto'}} className="card assets card-medium medium-padding full-height">
                                            <div className="form-group-app">
                                                <div className="form-title">
                                                    <p>Sell {this.state.asset.name}</p>
                                                    <div className="form-sub-title">
                                                        balance: <strong>{this.props.amountATM} ATM</strong>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Quantity</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <input ref="quantity2" placeholder='Recipient' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Price</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <input ref="priceATM2" placeholder='Quantity' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Total</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <input ref="total2" placeholder='Price' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group-app offset-top display-block inline no-margin">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                        </div>
                                                        <div className="col-md-7">
                                                            <a
                                                                onClick={() => this.props.setBodyModalParamsAction('SELL_ASSET', {
                                                                    quantityATU: this.refs.quantity2.value,
                                                                    priceATM: this.refs.priceATM2.value,
                                                                    total: this.refs.total2.value,
                                                                    assetInfo: this.state.asset
                                                                })}
                                                                className="btn static blue"
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
                                                <div className="form-title">
                                                    <p>Offers to buy {this.state.asset.name}</p>
                                                </div>
                                                <div className="info-box simple">
                                                    <p>No buy offersfor this aaset.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetExchange);