/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-form';
import {NotificationManager} from 'react-notifications';
import classNames from 'classnames';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import InputForm from "../../components/input-form";
import ModalFooter from "../../components/modal-footer";
import ButtonWrapper from "../mandatory-approval/components/ModalFooter";
import utils from "../../../../src/helpers/util/utils";
import CancelButton from "../mandatory-approval/components/CancelButton";
import submitForm from "../../../helpers/forms/forms";
import FeeCalc from '../../components/form-components/fee-calc';

class ReserveCurrency extends React.Component {
    state = {
        activeTab: 0,
        reserve: 0,
        isPending: false,
    };

    handleFormSubmit = async (values) => {
        if (!this.state.isPending) {
            this.setState({isPending: true});

            if (!values.secretPhrase || values.secretPhrase.length === 0) {
                NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
                this.setState({isPending: false});
                return;
            }

            const toSend = {
                currency: this.props.modalData.currency,
                decimals: this.props.modalData.decimals,
                amountPerUnitATM: Number(this.state.reserve),
                deadline: 1440,
                phased: false,
                phasingHashedSecretAlgorithm: 2,
                secretPhrase: values.secretPhrase,
                feeATM: values.feeATM,
            };

            await this.props.processForm(toSend, 'currencyReserveIncrease', 'Reserve has been increased!', (res) => {
                NotificationManager.success('Reserve has been increased!', null, 5000);
                this.props.setBodyModalParamsAction(null, {});
            });
            this.setState({isPending: false});
        }
    };

    render() {
        const { modalData } = this.props;

        return (
            <div className="modal-box">
                <form className="modal-form">
                    <div className="form-group-app">
                        <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close"/></button>

                        <div className="form-title">
                            <p>Reserve Currency - {modalData.code}</p>
                            <br/>
                        </div>
                        <div className="form-group mb-15">
                            <label>
                                Reserve supply
                            </label>
                            <div>
                                <span>{modalData.reserveSupply / Math.pow(10, modalData.decimals)}</span>
                            </div>
                        </div>
                        <div className="form-group mb-15">
                            <label>
                                Initial supply included
                            </label>
                            <div>
                                <span>{modalData.initialSupply / Math.pow(10, modalData.decimals)}</span>
                            </div>
                        </div>
                        <div className="form-group mb-15">
                            <label>
                                Target reserve
                            </label>
                            <div>
                                <span>{modalData.minReservePerUnitATM / Math.pow(10, modalData.decimals)}</span>
                            </div>
                        </div>
                        <div className="form-group mb-15">
                            <label>
                                Current reserve
                            </label>
                            <div>
                                <span>{modalData.currentReservePerUnitATM / Math.pow(10, modalData.decimals)}</span>
                            </div>
                        </div>
                        <Form
                            onSubmit={this.handleFormSubmit}
                            render={({
                                         submitForm, values, setValue, getFormState
                                     }) => <React.Fragment>
                                <div className="form-group mb-15">
                                    <label>
                                        Amount to reserve
                                    </label>
                                    <div className="input-group">
                                        <InputForm
                                            defaultValue={''}
                                            field="amount"
                                            placeholder="Amount"
                                            type="tel"
                                            onChange={(value) => {
                                                const amount = parseFloat(value || 0);
                                                const decimals = parseFloat(modalData.decimals);
                                                const reserveSupply = parseFloat(modalData.reserveSupply);
                                                const result = utils.resolverReservePerUnit(decimals, reserveSupply, amount);
                                                this.setState({
                                                    reserve: result.total,
                                                });
                                            }}
                                            setValue={setValue}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">{this.props.ticker}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mb-15">
                                    <label>
                                        Reserve per unit
                                    </label>
                                    <div>
                                        <span>{this.state.reserve}</span>
                                    </div>
                                </div>
                                <FeeCalc
                                    values={getFormState().values}
                                    setValue={setValue}
                                    requestType={'currencyReserveIncrease'}
                                    defaultValue={1}
                                />
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                <ButtonWrapper>
                                    <CancelButton
                                        close={this.props.closeModal}
                                    />
                                    <button
                                        type="submit"
                                        className={classNames({
                                            "btn btn-green submit-button": true,
                                            "loading btn-green-disabled": this.state.isPending,
                                        })}
                                        onClick={submitForm}
                                    >
                                        <div className="button-loader">
                                            <div className="ball-pulse">
                                                <div/>
                                                <div/>
                                                <div/>
                                            </div>
                                        </div>
                                        <span className={'button-text'}>Reserve</span>
                                    </button>
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
    ticker: state.account.ticker,
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReserveCurrency);
