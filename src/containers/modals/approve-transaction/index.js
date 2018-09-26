import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import InputForm from '../../components/input-form';
import {Form, Text, Number} from 'react-form';
import submitForm from "../../../helpers/forms/forms";
import {getBlockAction} from "../../../actions/blocks";
import {getCurrencyAction} from "../../../actions/currencies";
import {getAssetAction} from "../../../actions/assets";
import {NotificationManager} from "react-notifications";
import {calculateFeeAction} from "../../../actions/forms";
import crypto from "../../../helpers/crypto/crypto";
import {formatTimestamp} from "../../../helpers/util/time";

class ApproveTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,

            answers: [''],
            currency: '-',
            asset: 'Not Existing',
        }
    }

    handleFormSubmit = async (values) => {
        const {transaction} = this.props.modalData;
        values.publicKey = await crypto.getPublicKeyAPL(values.secretPhrase);
        const res = await this.props.submitForm( {
            ...values,
            transactionFullHash: transaction.fullHash,
            phased: false,
            deadline: 1440,
        }, "approveTransaction");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Transaction has been approved!', null, 5000);
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

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={
                        ({submitForm, values, addValue, removeValue, setValue, getFormState}) => (
                            <form
                                className="modal-form"
                                onSubmit={submitForm}
                            >
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></a>
                                    <div className="form-title">
                                        <p>Approve Transaction</p>
                                    </div>
                                    <p>Transaction ID {this.props.modalData.transaction.transaction} ({this.props.formatTimestamp(this.props.modalData.transaction.timestamp)})</p>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                field="feeAPL"
                                                placeholder="Minimum fee"
                                                type={"float"}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">Apollo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Passphrase <i className="zmdi zmdi-portable-wifi-changes"/>
                                        </label>
                                        <div className="col-sm-9">
                                            <Text className="form-control" field="secretPhrase"
                                                  placeholder="Secret Phrase" type={'password'}/>
                                        </div>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                        <a
                                            onClick={() => this.props.closeModal()}
                                            className="btn round round-top-left"
                                        >
                                            Cancel
                                        </a>
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                    {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-right round round-bottom-left round-top-right absolute"
                                            style={{left: 0, right: 'auto'}}
                                        >
                                            {this.state.advancedState ? "Basic" : "Advanced"}
                                        </a>
                                    </div>
                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />*/}
                                </div>
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
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApproveTransaction);
