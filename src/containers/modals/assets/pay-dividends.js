/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../modules/modals';
import InputForm from '../../components/input-form';
import {Checkbox, Form, Text, TextArea} from 'react-form';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import ModalFooter from '../../components/modal-footer';
import {getBlockAction} from "../../../actions/blocks";
import FeeCalc from '../../components/form-components/fee-calc';

import BackForm from '../modal-form/modal-form-container';

class PayDividends extends React.Component {
    state = {
        activeTab: 0,
        advancedState: false,
        currentHeight: -1,
        // submitting
        passphraseStatus: false,
        recipientStatus: false,
        amountStatus: false,
        feeStatus: false
    };

    async componentDidMount() {
        const block = await this.props.getBlock();
        this.setState({
            currentHeight: block.height,
        })
    }

    handleFormSubmit = async (values) => {
        const toSend = {
            height: values.height,
            deadline: 1440,
            phased: false,
            asset: this.props.modalData.asset,
            amountATMPerATU: values.shareAmount * Math.pow(10, 7),
            secretPhrase: values.secretPhrase,
            feeATM: values.feeATM,
        };

        this.props.processForm(values, 'dividendPayment', 'Dividends paid!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Dividends paid!', null, 5000);
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
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({submitForm, values, addValue, removeValue, setValue, getFormState}) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)}
                              onSubmit={submitForm}>
                            {
                                this.props.modalData &&
                                <div className="form-group-app">
                                    <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></button>

                                    <div className="form-title">
                                        {this.props.modalsHistory.length > 1 &&
                                        <div className={"backMy"} onClick={() => {
                                            this.props.openPrevModal()
                                        }}/>
                                        }
                                        <p>Pay Dividends</p>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Amount Per Share
                                        </label>
                                        <div className="col-sm-9 input-group input-group-text-transparent">
                                            <InputForm
                                                field="shareAmount"
                                                placeholder="Amount"
                                                type={"tel"}
                                                setValue={setValue}/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">{this.props.ticker}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Height. Current height: {this.state.currentHeight}
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="height"
                                                placeholder="Height"
                                                type={"tel"}
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="mobile-class row mb-15 form-group-white">
                                        <div className="col-md-9 offset-md-3">
                                            <div className="form-check custom-checkbox mb-2">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="isMessage"/>
                                                <label className="form-check-label custom-control-label">
                                                    Add a message?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        getFormState().values.isMessage &&
                                        <div className="form-group row form-group-white mb-15">
                                            <label className="col-sm-3 col-form-label align-self-start">
                                                Message
                                            </label>
                                            <div className="col-sm-9">
                                                <TextArea className="form-control" placeholder="Message" field="message"
                                                          cols="30" rows="5"/>
                                            </div>
                                        </div>
                                    }

                                    <FeeCalc
                                        values={getFormState().values}
                                        setValue={setValue}
                                        requestType={'dividendPayment'}
                                    />
                                    <ModalFooter
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                    />
                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />
                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <button
                                            type="submit"
                                            className="btn btn-right blue round round-bottom-right">
                                            Pay Dividends
                                        </button>
                                        <button
                                            type={'button'}
                                            onClick={() => this.props.closeModal()}
                                            className="btn btn-right round round-top-left"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                    {/*<a*/}
                                    {/*onClick={this.handleAdvancedState}*/}
                                    {/*className="btn btn-left round round-bottom-left round-top-right"*/}
                                    {/*>*/}
                                    {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                    {/*</a>*/}
                                    {/*</div>*/}
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
    modalData: state.modals.modalData,
	  ticker: state.account.ticker,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
    getBlock: () => dispatch(getBlockAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PayDividends);
