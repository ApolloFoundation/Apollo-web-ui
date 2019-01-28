/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';

import submitForm from "../../../../helpers/forms/forms";
import {getAccountCurrenciesAction} from "../../../../actions/currencies";

import {handleFormSubmit} from './handleFormSubmit';

import ModalBody from '../../../components/modals/modal-body';
import BlockHeightInput from '../../../components/form-components/block-height-input';
import NumericInput from '../../../components/form-components/numeric-input';
import TextualInputComponent from '../../../components/form-components/textual-input';

class OfferCurrency extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            block: null,
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    handleFormSubmit = (values) => {
        const {currency, decimals} = this.state.currency;

        this.props.handleFormSubmit({...values,  currency, decimals});
    }

    componentDidMount = () => {
        this.getCurrency(this.props);
    };

    getCurrency = async (newState) => {
        const currency = await this.props.getAccountCurrenciesAction({
            currency: this.props.modalData.currency,
            account: newState.account,
            includeCurrencyInfo: true
        });

        if (currency && currency.unconfirmedUnits) {
            this.setState({
                currencyAvailable : currency.unconfirmedUnits / Math.pow(10, currency.decimals),
                currency
            })
        } else {
            this.setState({
                currencyAvailable : null
            })
        }
    }

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Offer Currency'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Offer Currency'}
            >

                <TextualInputComponent
                    label={`Currency ${this.props.modalData.code}`}
                    text={!!(this.state.currencyAvailable)
                        ? `Currency units available ${(this.state.currencyAvailable)}`
                        : "None Available"}
                />
                
                <NumericInput
                    label={'Buy units (Initial'}
                    field={'initialBuySupply'}
                    countingTtile={this.props.modalData.code}
                    placeholder={'Amount'}
                    type={'tel'}
                />
                <NumericInput
                    label={'Buy units (Limit)'}
                    field={'totalBuyLimit'}
                    countingTtile={this.props.modalData.code}
                    placeholder={'Amount'}
                    type={'tel'}
                />
                <NumericInput
                    label={'Buy Rate per unit'}
                    field={'buyRateATM'}
                    countingTtile={`${this.props.modalData.code} / APL`}
                    placeholder={'Amount'}
                    type={'tel'}
                />
                <NumericInput
                    label={'Sell units (Initial)'}
                    field={'initialSellSupply'}
                    countingTtile={this.props.modalData.code}
                    placeholder={'Amount'}
                    type={'tel'}
                />
                <NumericInput
                    label={'Sell units (Limit)'}
                    field={'totalSellLimit'}
                    countingTtile={this.props.modalData.code}
                    placeholder={'Amount'}
                    type={'tel'}
                />
                <NumericInput
                    label={'Sell Rate per unit'}
                    field={'sellRateATM'}
                    countingTtile={`${this.props.modalData.code} / APL`}
                    placeholder={'Amount'}
                    type={'tel'}
                />
                <BlockHeightInput 
                    label={'Finish height'}
                    field={'expirationHeight'}
                    placeholder={'Finish height'}
                />
                
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    handleFormSubmit: (values) => dispatch(handleFormSubmit(values)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getAccountCurrenciesAction: (requestParams) => dispatch(getAccountCurrenciesAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OfferCurrency);
