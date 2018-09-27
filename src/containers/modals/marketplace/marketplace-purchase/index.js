/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import {getDGSPurchaseAction, getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import AdvancedSettings from '../../../components/advanced-transaction-settings'
import InputForm from '../../../components/input-form';
import { Form, Text, Checkbox } from 'react-form';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import crypto from "../../../../helpers/crypto/crypto";


const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSPurchaseAction: (requestParams) => dispatch(getDGSPurchaseAction(requestParams)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

class MarketplacePurchase extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            goods: null
        };

    }

    componentDidMount() {
        this.handleImageLoadint(this.props.modalData)
    }

    handleImageLoadint = async (value) => {
        const productData = await this.props.getDGSPurchaseAction({
            purchase: value
        });

        const productGoods = await this.props.getDGSGoodAction({
            goods: value
        });

        if (productData && !productData.errorCode) {
            this.setState({
                goods: productData
            })
            return;
        }
        if (productGoods && !productGoods.errorCode) {
            this.setState({
                goods: productGoods
            })
            return;
        }
    };

    async handleFormSubmit(values) {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Pass Phrase is required.', 'Error', 5000);
            return;
        }
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);
        if (!isPassphrase) {
            NotificationManager.error('Incorrect Pass Phrase.', 'Error', 5000);
            return;
        }

        values = {
            ...values,
            priceATM: parseInt(this.state.goods.priceATM) / 100000000,
            goods: this.state.goods.goods,
            recipient: this.props.account,
            secretPhrase: values.secretPhrase
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'dgsPurchase');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })

            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Goods has been purchased!', null, 5000);
        }
    }

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
                advancedState: true
            })
        }
    };

    render() {
        return (
            <div className="modal-box x-wide">
                <div className="modal-form">
                    <div className="form-group-app devided no-padding-bottom overflow-hidden">
                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                        {

                            this.state.goods &&

                            [
                                <div className="left-bar">
                                    <div className="top-bar">
                                        <div
                                            style={{
                                                backgroundImage: 'url(' + config.api.serverUrl + 'requestType=downloadPrunableMessage&transaction=' + this.state.goods.goods + '&retrieve=true)'
                                            }}
                                            className={classNames({
                                                "marketplace-image": true,
                                                "no-image": !this.state.goods.hasImage
                                            })}
                                        />
                                    </div>
                                    <div className="bottom-bar">
                                        <div className="description word-brake">
                                            {this.state.goods.description}
                                        </div>
                                    </div>
                                </div>,
                                <div className="right-bar">
                                    <div className="form-title">
                                        <p>{this.state.goods.name}</p>
                                    </div>
                                    <div className="price">
                                        {this.state.goods.priceATM / 100000000} Apollo
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Date:
                                        </label>
                                        <div className="col-sm-9">
                                            {this.props.formatTimestamp(this.state.goods.timestamp)}
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Seller:
                                        </label>
                                        <div className="col-sm-9">
                                            {this.state.goods.sellerRS}
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Quantity:
                                        </label>
                                        <div className="col-sm-9">
                                            {this.state.goods.quantity}
                                        </div>
                                    </div>
                                    <Form
                                        onSubmit={(values) => this.handleFormSubmit(values)}
                                        render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (

                                            <form className="modal-form" onSubmit={submitForm}>
                                                <div className="form-group-app no-padding-left no-padding-top">
                                                    <div className="form-group row form-group-white mb-15">
                                                        <label className="col-sm-3 col-form-label">
                                                            Quantity
                                                        </label>
                                                        <div className="col-sm-9">
                                                            <InputForm
                                                                defaultValue={1}
                                                                type="number"
                                                                field="quantity"
                                                                placeholder="Currency Name"
                                                                minValue={1}
                                                                setValue={setValue}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row form-group-white mb-15">
                                                        <label className="col-sm-3 col-form-label">
                                                            Delivery deadline (hours)
                                                        </label>
                                                        <div className="col-sm-9">
                                                            <InputForm
                                                                defaultValue={168}
                                                                type="number"
                                                                field="deliveryDeadlineTimestamp"
                                                                placeholder="Currency Code"
                                                                setValue={setValue}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row form-group-white mb-15">
                                                        <label className="col-sm-3 col-form-label">
                                                            Fee
                                                        </label>
                                                        <div className="col-sm-9">
                                                            <InputForm
                                                                type="float"
                                                                field="feeATM"
                                                                placeholder="Minimum fee"
                                                                setValue={setValue}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row form-group-white mb-15">
                                                        <label className="col-sm-3 col-form-label">
                                                            Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                                        </label>
                                                        <div className="col-sm-9">
                                                            <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                                        </div>
                                                    </div>
                                                    {/*<AdvancedSettings
                                                        setValue={setValue}
                                                        getFormState={getFormState}
                                                        values={values}
                                                        advancedState={this.state.advancedState}
                                                    />*/}
                                                </div>
                                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                                    <a
                                                        onClick={() => this.props.closeModal()}
                                                        className="btn round round-top-left"
                                                    >
                                                        Cancel
                                                    </a>
                                                    {
                                                        !!this.state.isPending ?
                                                            <div
                                                                style={{
                                                                    width: 68.48
                                                                }}
                                                                className="btn btn-right blue round round-bottom-right"
                                                            >
                                                                <div className="ball-pulse">
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                </div>
                                                            </div> :
                                                            <button

                                                                type="submit"
                                                                name={'closeModal'}
                                                                className="btn btn-right blue round round-bottom-right"
                                                            >
                                                                Purchase
                                                            </button>
                                                    }
                                                </div>
                                                {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                                    {
                                                        this.state.advancedState &&
                                                        <a
                                                            onClick={this.handleAdvancedState}
                                                            className="btn btn-right round round-top-right absolute"
                                                            style={{left : 'calc(50% - 35px)', right: 'auto'}}
                                                        >
                                                            Basic
                                                        </a>
                                                    }
                                                    {
                                                        !this.state.advancedState &&
                                                        <a
                                                            onClick={this.handleAdvancedState}
                                                            className="btn btn-right round round-top-right absolute"
                                                            style={{left : 'calc(50% - 35px)', right: 'auto'}}
                                                        >
                                                            Advanced
                                                        </a>
                                                    }
                                                </div>*/}
                                            </form>
                                        )}
                                    />
                                </div>
                            ]
                        }
                    </div>
                </div>
            </div>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(MarketplacePurchase);
