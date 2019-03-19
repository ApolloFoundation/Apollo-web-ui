/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {handleFormSubmit} from './handleFormSubmit';

// Form components

import ModalBody from '../../../components/modals/modal-body';
import AccountRSFormInput from '../../../components/form-components/account-rs';
import NumericInput from '../../../components/form-components/numeric-input';
// import IssueCurrencyForm from './form';
import CurrencyInput from '../../../components/form-components/currency-input';


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

    handleFormSubmit = values => this.props.handleFormSubmit(values);
   
    render() {
        const {code} = this.props.modalData;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Transfer Currency'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Transfer Currency'}
            >
                <CurrencyInput 
                    field={'currency'}
                    defaultValue={code}
                    disabled={!this.props.modalData}
                />
                <AccountRSFormInput
                    defaultValue={this.props.modalData.recipient}
                    field={'recipient'}
                    label={'Recipient'}
                />
                <NumericInput
                    field={'units'}
                    label={'Units'}
                    placeholder={'Units'}
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    handleFormSubmit: (values) => dispatch(handleFormSubmit(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(TransferCurrency);
