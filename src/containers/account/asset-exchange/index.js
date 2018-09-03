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
import {setAlert} from "../../../modules/modals";
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
        console.log(values);

        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);
        console.log(isPassphrase);
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



        console.log(this.state.asset);
        console.log(await crypto.getPublicKey(values.secretPhrase));

        values.publicKey = await crypto.getPublicKey(values.secretPhrase);
        values.asset = this.state.asset.asset;
        values.deadline = '1440';
        values.asset_order_type = 'placeAskOrder';
        values.phasingHashedSecretAlgorithm = '2';

        console.log(values);
        console.log(this.state.asset.decimals);
        values.priceATM =    values.priceATM  * Math.pow(10, 6);
        values.quantityATU = values.quantityATU  * Math.pow(10, this.state.asset.decimals);
        values.feeATM =      values.feeATM  * Math.pow(10, 8);
        console.log(values);

        delete values.secretPhrase;
        this.props.buyAssetAction(values);
        this.props.setAlert('success', 'The buy order has been submitted.');
    };

    handleSellFormSubmit = (values) => {
        console.log(values);
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
                    <div className="page-body container-fluid">

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
                                            <Form
                                                onSubmit={(values) => this.handleBuyFormSubmit(values)}
                                                render={({ submitForm, values, addValue, removeValue }) => (
                                                    <form className="form-group" onSubmit={submitForm}>
                                                        <div className="form-title">
                                                            <p>Buy {this.state.asset.name}</p>
                                                            <div className="form-sub-title">
                                                                balance: <strong>{this.props.amountATM} ATM</strong>
                                                            </div>
                                                        </div>
                                                        <div className="input-group">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Quantity</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="quantityATU" placeholder='Quantity' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Price</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="priceATM" placeholder='Price' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Total</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="totalATM" placeholder='Total' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Fee</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="feeATM" placeholder='Fee' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Pass phrase</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="secretPhrase" placeholder='Secret phrase'  type={'password'}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            this.state.passphraseStatus &&
                                                            <InfoBox danger mt>
                                                                Incorrect passphrase.
                                                            </InfoBox>
                                                        }
                                                        {
                                                            this.state.recipientStatus &&
                                                            <InfoBox danger mt>
                                                                Incorrect recipient.
                                                            </InfoBox>
                                                        }
                                                        {
                                                            this.state.amountStatus &&
                                                            <InfoBox danger mt>
                                                                Missing amount.
                                                            </InfoBox>
                                                        }
                                                        {
                                                            this.state.feeStatus &&
                                                            <InfoBox danger mt>
                                                                Missing fee.
                                                            </InfoBox>
                                                        }

                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label></label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <button className="btn static blue">Buy (NXT > {this.state.asset.name})</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )}
                                            />
                                        </div>
                                        <div className="card ballance card-tiny medium-padding">
                                            <div className="form-group">
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
                                            <Form
                                                onSubmit={(values) => this.handleSellFormSubmit(values)}
                                                render={({ submitForm, values, addValue, removeValue }) => (
                                                    <form className="form-group" onSubmit={submitForm}>
                                                        <div className="form-title">
                                                            <p>Buy {this.state.asset.name}</p>
                                                            <div className="form-sub-title">
                                                                balance: <strong>{this.props.amountATM} ATM</strong>
                                                            </div>
                                                        </div>
                                                        <div className="input-group">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Quantity</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="quantityATU" placeholder='Quantity' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Price</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="priceATM" placeholder='Price' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Total</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="totalATM" placeholder='Total' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Fee</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="feeATM" placeholder='Fee' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label>Pass phrase</label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <Text field="secretPhrase" placeholder='Secret phrase'  type={'password'}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            this.state.passphraseStatus &&
                                                            <InfoBox danger mt>
                                                                Incorrect passphrase.
                                                            </InfoBox>
                                                        }
                                                        {
                                                            this.state.recipientStatus &&
                                                            <InfoBox danger mt>
                                                                Incorrect recipient.
                                                            </InfoBox>
                                                        }
                                                        {
                                                            this.state.amountStatus &&
                                                            <InfoBox danger mt>
                                                                Missing amount.
                                                            </InfoBox>
                                                        }
                                                        {
                                                            this.state.feeStatus &&
                                                            <InfoBox danger mt>
                                                                Missing fee.
                                                            </InfoBox>
                                                        }

                                                        <div className="input-group offset-top display-block inline no-margin">
                                                            <div className="row">
                                                                <div className="col-md-5">
                                                                    <label></label>
                                                                </div>
                                                                <div className="col-md-7">
                                                                    <button className="btn static blue">Buy (NXT > {this.state.asset.name})</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )}
                                            />
                                        </div>
                                        <div className="card assets card-tiny medium-padding">
                                            <div className="form-group">
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