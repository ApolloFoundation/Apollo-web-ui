import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text} from 'react-form';

import AccountRS from '../../components/account-rs';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

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

    handleFormSubmit = async(values) => {
        values = {
            ...values,
            units: values.units * Math.pow(10, this.props.modalData.decimals)
        };

        this.props.submitForm(null, null, values, 'transferCurrency')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});
                    NotificationManager.success('Transfer currency request has been submitted!', null, 5000);
                }
            })
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
                    render={({ submitForm, values, addValue, removeValue, setValue }) => (
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
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                            <Text
                                                type="hidden"
                                                className="form-control"
                                                field="currency"
                                                placeholder="Account"
                                                defaultValue={this.props.modalData.currency}
                                                aria-describedby="amountText"/>
                                            <p>{this.props.modalData.code}</p>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom inline user">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Recipient</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="iconned-input-field">
                                                    <AccountRS
                                                        field={'recipient'}
                                                        setValue={setValue}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-grey mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Units
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                            <Text
                                                type="text"
                                                className="form-control"
                                                field="units"
                                                placeholder="Account"
                                                aria-describedby="amountText"/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.modalData.code}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row form-group-white mb-15">
                                        <label htmlFor="feeATM" className="col-sm-3 col-form-label">
                                            Fee
                                            <span
                                                onClick={async () => {
                                                        setValue("feeATM", 1);
                                                    }
                                                }
                                                style={{paddingRight: 0}}
                                                className="calculate-fee"
                                            >
                                            Calculate
                                        </span>
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                            <Text defaultValue={(this.props.modalData && this.props.modalData.feeATM) ? this.props.modalData.feeATM : ''}
                                                  id="feeATM"
                                                  field="feeATM"
                                                  className="form-control"
                                                  value={this.state.feeATM}
                                                  placeholder="Amount"
                                                  type={"number"}
                                                  aria-describedby="feeATMText" />
                                            <div className="input-group-append">
                                                <span className="input-group-text" id="feeATMText">Apollo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Secret Phrase</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text placeholder={'Secret Phrase'} type="password" field={'secretPhrase'}/>
                                            </div>
                                        </div>
                                    </div>

                                    <AdvancedSettings
                                        setValue={setValue}
                                        advancedState={this.state.advancedState}
                                    />

                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Buy
                                        </button>
                                        <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>
                                    </div>
                                    <div className="btn-box align-buttons-inside absolute left-conner">
                                        <a
                                            onClick={this.handleAdvancedState}
                                            className="btn btn-left round round-bottom-left round-top-right"
                                        >
                                            Advanced
                                        </a>
                                    </div>
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferCurrency);
