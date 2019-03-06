/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {Text} from 'react-form';

import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import {getCurrencyAction, getAccountCurrenciesAction} from "../../../../actions/currencies";

import ModalBody from '../../../components/modals/modal-body';

import TextualInputComponent from '../../../components/form-components/textual-input';
import FormRowText from '../../../components/form-components/form-row-text';


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

    handleFormSubmit = (values) => {
        const currency = this.state.currency;

        this.props.processForm({...values, currency: currency ? currency.currency : null}, 'currencyReserveClaim', 'Claim currency has been submitted!', () => {
			this.props.setBodyModalParamsAction(null, {});
			NotificationManager.success('Claim currency has been submitted!', null, 5000);
		});
    }

    componentDidMount = () => {
        this.getCurrency(this.props.modalData)
    }

    render () {
        const {nameModal} = this.props;
        const {accountCurrecny, currency} = this.state;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Claim Currency'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Claim Currency'}
                nameModel={nameModal}
            >
                {
                    accountCurrecny && 
                    currency &&
                    <FormRowText
                        text={`Number of units to claim ${accountCurrecny.currentSupply / Math.pow(10, accountCurrecny.decimals)} Claim rate ${accountCurrecny.currentReservePerUnitATM / Math.pow(10, accountCurrecny.decimals)} [Apollo/${currency.code}]`}
                    />
                }

                <TextualInputComponent 
                    label={'Number of units to claim'}
                    placeholder={'Number of units'}
                    field={'units'}
                    type={'tel'}
                    code={currency ? currency.code : '' }
                />
                
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams)),
    getAccountCurrenciesAction: (reqParams) => dispatch(getAccountCurrenciesAction(reqParams)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimCurrency)