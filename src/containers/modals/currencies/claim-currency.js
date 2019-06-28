import React from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-form';
import {NotificationManager} from "react-notifications";

import {getAccountCurrenciesAction} from '../../../actions/currencies';
import {getCurrencyAction} from "../../../actions/currencies";

import ModalFooter from '../../components/modal-footer';
import BackForm from '../modal-form/modal-form-container';

import AdvancedSettings from '../../components/advanced-transaction-settings';
import {CustomInputForm} from '../../components/form-components/textual-input';
import {FormRowText} from '../../components/form-components/form-row-text';
import FeeCalc from '../../components/form-components/fee-calc'
import {SubmitFormButton} from '../../components/form-components/submit-button'
import {saveSendModalState, openPrevModal} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";

class ClaimCurrency extends React.Component {

    state = {};
    
    getCurrency = async (currency) => {
        const currencyInfo    = await this.props.getAccountCurrenciesAction({currency, account: this.props.account});
        const accountCurrecny = await this.props.getCurrencyAction({currency});
        
        if (currency && accountCurrecny) {
            this.setState({
                currency: currencyInfo,
                accountCurrecny
            })
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

    handleFormSubmit = async (values) => {
        values = {
            ...values,
            units: values.units * Math.pow(10, this.state.accountCurrecny.decimals),
            decimals: this.state.accountCurrecny.decimals,
            currency: this.state.accountCurrecny.currency
        }

        this.setState({
            isPending: true
        })

        const responce = await this.props.submitForm(values, 'currencyReserveClaim');

        if (responce) {
            if (responce.errorCode) {
                NotificationManager.error(responce.errorDescription, 'Error', 5000);
                this.setState({
                    isPending: false
                })
            } else {
                NotificationManager.success('Currency has been claimed successfully!', null, 5000);
                this.props.setBodyModalParamsAction(null, {});
            }
        }
    }

    componentDidMount = () => {
        this.getCurrency(this.props.modalData)
    }

    render () {
        return (
            <div className="modal-box">
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)} onSubmit={submitForm}>
                            {
                                this.props.modalData &&

                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        {this.props.modalsHistory && this.props.modalsHistory.length > 1 &&
                                        <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
                                        }
                                        <p>Claim Currency</p>
                                    </div>

                                    {
                                        this.state.accountCurrecny && 
                                        this.state.currency &&
                                        <FormRowText
                                            text={`Number of units to claim ${this.state.accountCurrecny.currentSupply / Math.pow(10, this.state.accountCurrecny.decimals)} Claim rate ${this.state.accountCurrecny.currentReservePerUnitATM / Math.pow(10, this.state.accountCurrecny.decimals)} [APL/${this.state.currency.code}]`}
                                        />
                                    }

                                    
                                    <CustomInputForm 
                                        label={'Number of units to claim'}
                                        setValue={setValue}
                                        placeholder={'Number of units'}
                                        field={'units'}
                                        type={'tel'}
                                        code={this.state.currency ? this.state.currency.code : '' }
                                    />
                                    
                                    <FeeCalc
                                        setValue={setValue}
                                        values={getFormState().values}
                                        requestType={'currencyReserveClaim'}
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

                                        <SubmitFormButton text="Claim Currency" loading={this.state.isPending}/>
                                        <button
                                            type={'button'}
                                            onClick={() => this.props.closeModal()}
                                            className="btn btn-right round round-top-left"
                                        >
                                            Cancel
                                        </button>
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
    modalData: state.modals.modalData,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getAccountCurrenciesAction : (reqParams) => dispatch(getAccountCurrenciesAction(reqParams)),
    getCurrencyAction          : (reqParams) => dispatch(getCurrencyAction(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimCurrency)