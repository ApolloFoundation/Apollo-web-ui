/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import crypto from "helpers/crypto/crypto";
import ModalBody from 'containers/components/modals/modal-body';
import { getModalDataSelector, getModalHistorySelector } from 'selectors';

class ApproveTransaction extends React.Component {
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
            this.props.closeModal();
            NotificationManager.success('Transaction has been approved!', null, 5000);
        });
    };

    render() {
        return (
            <ModalBody
                modalTitle='Approve Transaction'
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName='Approve Transaction'
            />
        );
    }
}

const mapStateToProps = state => ({
    modalData: getModalDataSelector(state),
    modalsHistory: getModalHistorySelector(state),
});

export default connect(mapStateToProps)(ApproveTransaction);
