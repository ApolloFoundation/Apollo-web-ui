/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import InputForm from "../../components/input-form";
import ModalFooter from "../../components/modal-footer";
import ButtonWrapper from "../mandatory-approval/components/ModalFooter";
import {Form} from "react-form";
import utils from "../../../../src/helpers/util/utils";
import SubmitButton from "../mandatory-approval/components/SubmitButton";
import CancelButton from "../mandatory-approval/components/CancelButton";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";

import ModalBody from '../../components/modals/modal-body';
import FeeCalc from '../../components/form-components/fee-calc';

class ReserveCurrency extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,
            reserve: 0,
        }

    }

    handleFormSubmit = async (values) => {
        if (!values.secretPhrase || values.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
        }

        const toSend = {
            currency: this.props.modalData.currency,
            decimals: this.props.modalData.decimals,
            amountPerUnitATM: this.state.reserve,
            deadline: 1440,
            phased: false,
            phasingHashedSecretAlgorithm: 2,
            secretPhrase: values.secretPhrase,
            feeATM: values.fee,
        };

        this.props.processForm(toSend, 'currencyReserveIncrease', 'Reserve has been increased!', (res) => {
            NotificationManager.success('Reserve has been increased!', null, 5000);
            
            this.props.setBodyModalParamsAction(null, {});
        });
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
        const modalData = this.props.modalData;
        return (
            <div className="modal-box">
                <form className="modal-form">
                    <div className="form-group-app">
                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close"/></a>

                        <div className="form-title">
                            <p>Reserve Currency - {modalData.code}</p>
                            <br/>
                        </div>
                        <div className="form-group form-group-white row mb-15">
                            <label className="col-sm-3 col-form-label">
                                Reserve supply
                            </label>
                            <div
                                className="col-sm-9 input-group input-group-text-transparent bold input-group-sm">
                                {modalData.reserveSupply}
                            </div>
                        </div>
                        <div className="form-group form-group-white row mb-15">
                            <label className="col-sm-3 col-form-label">
                                Initial supply included
                            </label>
                            <div
                                className="col-sm-9 input-group input-group-text-transparent bold input-group-sm">
                                {modalData.initialSupply}
                            </div>
                        </div>
                        <div className="form-group form-group-white row mb-15">
                            <label className="col-sm-3 col-form-label">
                                Target reserve
                            </label>
                            <div
                                className="col-sm-9 input-group input-group-text-transparent bold input-group-sm">
                                {modalData.minReservePerUnitATM}
                            </div>
                        </div>
                        <div className="form-group form-group-white row mb-15">
                            <label className="col-sm-3 col-form-label">
                                Current reserve
                            </label>
                            <div
                                className="col-sm-9 input-group input-group-text-transparent bold input-group-sm">
                                {modalData.currentReservePerUnitATM}
                            </div>
                        </div>
                        <Form
                            getApi={form => {
                            }}
                            onSubmit={values => this.handleFormSubmit(values)}
                            render={({
                                         submitForm, values, addValue, removeValue, setValue, getFormState
                                     }) => <React.Fragment>
                                <div className="form-group form-group-white row mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Amount to reserve
                                    </label>
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            defaultValue={''}
                                            field="amount"
                                            placeholder="Amount"
                                            type="tel"
                                            onBlur={() => {
                                                const amount = values.amount;
                                                const decimals = modalData.decimals;
                                                const result = utils.resolverReservePerUnit(decimals, modalData.reserveSupply, amount);
                                                setValue("amount", result.amount);
                                                this.setState({
                                                    reserve: result.total,
                                                })
                                            }}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">Apollo</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group form-group-white row mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Reserve per unit
                                    </label>
                                    <div
                                        className="col-sm-9 input-group input-group-text-transparent bold input-group-sm">
                                        {this.state.reserve}
                                    </div>
                                </div>
                                <FeeCalc
                                    values={getFormState().values}
                                    setValue={setValue}
                                    requestType={'currencyReserveIncrease'}
                                />
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                <ButtonWrapper>
                                    <SubmitButton
                                        text={"Reserve"}
                                        submit={() => submitForm()}
                                    />
                                    <CancelButton
                                        close={this.props.closeModal}
                                    />
                                </ButtonWrapper>
                            </React.Fragment>}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReserveCurrency);
