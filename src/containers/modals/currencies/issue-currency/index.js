/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
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

const badWords = ['GSX', 'GSXX', 'GSXI', 'GSXII', 'GSXIII', 'GSXB', 'GXB'];

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

    handleCheckIsOk = (list) => {
        let errorWord = null;
        
        const isOk = list.split(" ").every(item => {
            if (badWords.indexOf(item.trim().toUpperCase()) === -1) return true
            errorWord = item;
            return false;
        });

        return {
            errorWord,
            isOk,
        }
    }

    handleFormSubmit = values => {
        const nameCheck = this.handleCheckIsOk(values.name);
        const codeCheck = this.handleCheckIsOk(values.code);
        
        const error = nameCheck.errorWord || codeCheck.errorWord; 
        if (nameCheck.isOk && codeCheck.isOk) handleFormSubmit.call(this.props, values);
        else NotificationManager.error(`You can't create a currency with "${error}" word`);
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
        const fromState = form.getFormState().values;

        return () => {
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
				idGroup={'issue-currency-modal-'}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueCurrency);
