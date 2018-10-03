/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../../modules/modals';
import  {getDGSGoodAction} from "../../../../actions/marketplace";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import classNames from 'classnames';
import {formatTimestamp} from '../../../../helpers/util/time'
import config from '../../../../config';

import AdvancedSettings from '../../../components/advanced-transaction-settings'
import { Form, Text, Checkbox } from 'react-form';
import InputForm from '../../../components/input-form';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import crypto from "../../../../helpers/crypto/crypto";
import ModalFooter from '../../../components/modal-footer'



const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.accountRS
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getDGSGoodAction: (requestParams) => dispatch(getDGSGoodAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

class MarketplaceChangeQuantity extends React.Component {
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
        const productData = await this.props.getDGSGoodAction({
            goods: value
        });

        if (productData) {
            this.setState({
                goods: productData
            })
        }
    };

    async handleFormSubmit(values) {
        const publicKey = await crypto.getPublicKeyAPL(values.secretPhrase, false);
        this.setState({
            isPending: true
        })
        values = {
            ...values,
            deltaQuantity: (values.quantity - this.state.goods.quantity),
            goods: this.state.goods.goods,
            recipient: this.props.account,
            publicKey: publicKey
        };

        const res = await this.props.submitForm( values, 'dgsQuantityChange')
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('The marketplace item\'s quantity has been changed successfully!', null, 5000);
        }
    }

    render() {
        return (
            <div className="modal-box x-wide">
                <div className="modal-form">
                    <div className="form-group-app devided no-padding-bottom">
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
                                                            Current quantity
                                                        </label>
                                                        <div className="col-sm-9">
                                                            {
                                                                this.state.goods &&
                                                                <p>{this.state.goods.quantity}</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group row form-group-white mb-15">
                                                        <label className="col-sm-3 col-form-label">
                                                            New quantity
                                                        </label>
                                                        <div className="col-sm-9">
                                                            {
                                                                this.state.goods &&
                                                                <InputForm
                                                                    defaultValue={this.state.goods.quantity}
                                                                    type="number"
                                                                    field="quantity"
                                                                    minValue={1}
                                                                    setValue={setValue}/>
                                                            }
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
                                                    <ModalFooter
                                                        setValue={setValue}
                                                        getFormState={getFormState}
                                                        values={values}
                                                    />
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
                                                                    width: 120
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
                                                                style={{
                                                                    width: 120
                                                                }}
                                                                type="submit"
                                                                name={'closeModal'}
                                                                className="btn btn-right blue round round-bottom-right"
                                                            >
                                                                Change quantity
                                                            </button>
                                                    }

                                                </div>
                                                {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                                    <a
                                                        onClick={this.handleAdvancedState}
                                                        className="btn btn-right round round-top-right absolute"
                                                        style={{left : 'calc(50% - 35px)', right: 'auto'}}
                                                    >
                                                        {this.state.advancedState ? "Basic" : "Advanced"}
                                                    </a>
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



export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceChangeQuantity);
