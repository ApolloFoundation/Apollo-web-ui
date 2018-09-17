import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import CustomSelect from '../../components/select';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import InputForm from '../../components/input-form';
import {Form, Text, TextArea, Number, Radio, RadioGroup} from 'react-form';
import submitForm from "../../../helpers/forms/forms";
import {getBlockAction} from "../../../actions/blocks";
import {getCurrencyAction} from "../../../actions/currencies";
import {getAssetAction} from "../../../actions/assets";
import {NotificationManager} from "react-notifications";
import {calculateFeeAction} from "../../../actions/forms";
import InfoBox from "../../components/info-box";
import crypto from "../../../helpers/crypto/crypto";

class OrderCancel extends React.Component {
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

    handleFormSubmit = async(values) => {

        const {modalData} = this.props;
        console.warn("modal dda ", modalData);
        values.publicKey = await crypto.getPublicKey(values.secretPhrase);
        const res = await this.props.submitForm(null, null, {
            ...values,
            order: modalData.order,
            phased: false,
            deadline: 0,
            phasingHashedSecretAlgorithm: 2,
        }, modalData.type);
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Your order has been canceled!', null, 5000);
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
                        ({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                            <form
                                className="modal-form"
                                onSubmit={submitForm}
                            >
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
                                    <div className="form-title">
                                        <p>Confirm Order Cancellation</p>
                                    </div>
                                    <InfoBox>
                                        If you are sure you want to cancel your order, type your passphrase to confirm.
                                    </InfoBox>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                            <InputForm
                                                field="feeAPL"
                                                placeholder="Minimum fee"
                                                type={"number"}
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
                                        <div className="col-sm-9 mb-0 no-left-padding">
                                            <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                        </div>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                        <a
                                            onClick={() => this.props.closeModal()}
                                            className="btn round round-top-left"
                                        >
                                            No, do not cancel
                                        </a>
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Cancel my order
                                        </button>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-right round round-bottom-left round-top-right absolute"
                                            style={{left : 0, right: 'auto'}}
                                        >
                                            {this.state.advancedState ? "Basic" : "Advanced"}
                                        </a>
                                    </div>
                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
    getAssetAction: (requestParams) => dispatch(getAssetAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancel);
