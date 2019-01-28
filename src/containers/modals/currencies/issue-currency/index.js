/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {
    setBodyModalParamsAction, 
} from '../../../../modules/modals';
import {handleFormSubmit} from './handleFormSubmit';

// Form components

import ModalBody from '../../../components/modals/modal-body';
import IssueCurrencyForm from './form';

const algorithmData = [
    {
        label: "SHA256",
        value: "2"
    },
    {
        label: "SHA3",
        value: "3",
    },
    {
        label: "SCRYPT",
        value: "5",
    },
    {
        label: "Keccak25",
        value: "25"
    }
];

class IssueCurrency extends React.Component {
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
            form : null
        }

    }

    handleFormSubmit = values => this.props.handleFormSubmit(values);

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

    handleClaimableValue = (value, setValue) => {
        if (value) {
            setValue('initialSupply', 0);
            setValue('type3', true);
        } else {
            setValue('initialSupply', '');
        }
    }

    loadForm = (form) => {
        this.setState({
            form
        }, () => this.setFormState(form)())
    }

    setFormState = (form) => {
        // console.log(form);
        const fromState = form.getFormState().values;

        return () => {
            console.log(fromState);

            this.setState({fromState})
        }
    }

    
    render() {

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Issue Currency'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Issue Currency'}
            >
                <IssueCurrencyForm />
            </ModalBody>
            
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    handleFormSubmit: (values) => dispatch(handleFormSubmit(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueCurrency);
