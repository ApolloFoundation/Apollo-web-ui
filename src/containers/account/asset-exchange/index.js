import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../components/site-header'
import {getAssetAction} from "../../../actions/assets";
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";

const mapStateToProps = state => ({
   amountATM: state.account.amountATM
});

const mapDispatchToProps = dispatch => ({
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams))
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

    handleSellFormSubmit = () => {

    };

    handleBuyFormSubmit = (values) => {
        console.log(values);
    };

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
                            <div className="col-md-6">
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

                                <div className="card ballance card-medium medium-padding">
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
                                                            <Text field="quantityATM" placeholder='Quantity' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Price</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <Text field="PriceATM" placeholder='Price' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Total</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <Text field="totalATM" placeholder='Total' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Fee</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <Text field="feeATM" placeholder='Fee' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label></label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <button className="btn blue">Buy (NXT > {this.state.asset.name})</button>
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
                                <div className="card assets card-medium medium-padding">
                                    <Form
                                        onSubmit={(values) => this.handleSellFormSubmit(values)}
                                        render={({ submitForm, values, addValue, removeValue }) => (
                                            <form className="form-group" onSubmit={submitForm}>
                                                <div className="form-title">
                                                    <p>Sell {this.state.asset.name}</p>
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
                                                            <Text field="quantityATM" placeholder='Quantity' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Price</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <Text field="PriceATM" placeholder='Price' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Total</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <Text field="totalATM" placeholder='Total' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label>Fee</label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <Text field="feeATM" placeholder='Fee' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <label></label>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <button className="btn blue">Sell ({this.state.asset.name} > NXT)</button>
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
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetExchange);