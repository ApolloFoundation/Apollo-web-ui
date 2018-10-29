/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import InputForm from '../../components/input-form';
import {Form, Text} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import ModalFooter from '../../components/modal-footer'
import {getCurrencyAction} from "../../../actions/currencies";

class TransferCurrency extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    componentDidMount = () => {
        this.getCurrency({code: this.props.modalData.code})
    }

    handleFormSubmit = async(values) => {
        values = {
            ...values,
            units: values.units * Math.pow(10, this.props.modalData.decimals)
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'transferCurrency');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Transfer currency request has been submitted!', null, 5000);
        }
    };

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

    getCurrency = async (reqParams) => {
        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency });
        } else {
            this.setState({ currency: '-' });
        }
    };

    render() {
        const code = this.props.modalData.currency;

        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            {
                                this.props.modalData &&

                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Transfer Currency</p>
                                    </div>
                                    <div className="form-group row form-group-grey mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Currency
                                        </label>
                                        <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
                                            <InputForm
                                                field="phasingHoldingCurrencyCode"
                                                placeholder="Code"
                                                defaultValue={this.props.modalData.code}
                                                onChange={(code) => this.getCurrency({code})}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">ID: {this.state.currency}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app form-group mb-15 display-block inline user">
                                        <div className="row form-group-white">
                                            <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                            </label>
                                            <div className="col-sm-9">
                                                <div className="iconned-input-field">
                                                    <AccountRS
                                                        field={'recipient'}
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Units
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent no-left-padding">
                                            <InputForm
                                                type={"number"}
                                                field="units"
                                                placeholder="Utils"
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee
                                            <span
                                                onClick={async () => {
                                                    setValue("feeAPL", 1);
                                                }}
                                                style={{paddingRight: 0}}
                                                className="calculate-fee"
                                            >
                                            Calculate
                                        </span>
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                            <InputForm
                                                field="feeAPL"
                                                defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                                placeholder="Minimum fee"
                                                type={"float"}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">Apollo</span>
                                            </div>
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

                                    <div className="btn-box align-buttons-inside absolute right-conner">

                                        {
                                            !!this.state.isPending ?
                                                <div
                                                    style={{
                                                        width: 70
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
                                                        width: 70
                                                    }}
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Transfer
                                                </button>
                                        }
                                        <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    </div>
                                    {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-left round round-bottom-left round-top-right"
                                        >
                                            {this.state.advancedState ? "Basic" : "Advanced"}
                                        </a>
                                    </div>*/}
                                </div>
                            }
                        </form>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferCurrency);
