/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../modules/modals';
import submitForm from "../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import crypto from "../../../helpers/crypto/crypto";
import ModalBody from '../../components/modals/modal-body';
import { getModalDataSelector, getModalHistorySelector } from '../../../selectors';

class ApproveTransaction extends React.Component {
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

            answers: [''],
            currency: '-',
            asset: 'Not Existing',
        }
    }

    handleFormSubmit = async (values) => {
        const {transaction} = this.props.modalData;
        values.publicKey = await crypto.getPublicKeyAPL(values.secretPhrase);

        values = {
            ...values,
            transactionFullHash: transaction.fullHash,
            phased: false,
            deadline: 1440,
        }

        this.props.processForm(values, "approveTransaction", 'Transaction has been approved!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Transaction has been approved!', null, 5000);
        });
    };

    render() {
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Approve Transaction'}
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Approve Transaction'}
            />
        );
    }
}

const mapStateToProps = state => ({
    modalData: getModalDataSelector(state),
    modalsHistory: getModalHistorySelector(state),
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApproveTransaction);
