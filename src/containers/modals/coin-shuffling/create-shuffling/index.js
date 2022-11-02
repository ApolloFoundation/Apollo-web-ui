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
import ModalBody from '../../../components/modals/modal-body';
import CreateShufflngForm from './form';

class CreateShuffling extends React.Component {
    handleFormSubmit = (values) => {
        values = {
            ...values,
            amount: values.amount * 100000000,
            registrationPeriod: 1439
        };

        this.props.processForm(values, 'shufflingCreate', 'Shuffling Created!', (res) => {
            NotificationManager.success('Shuffling Created!', null, 5000);

            const reqParams = {
                transactionBytes: res.transactionBytes || res.unsignedTransactionBytes,
                prunableAttachmentJSON: JSON.stringify({...(res.transactionJSON.attachment), "version.ShufflingCreation": 1}),
                createNoneTransactionMethod: true
            };

            this.props.processForm(reqParams, 'broadcastTransaction', 'Shuffling Created!', (broadcast) => {
                this.props.setBodyModalParamsAction('START_SHUFFLING', {broadcast});
            });
        })
    };

    render() {
        return (
            <ModalBody
                modalTitle={'Create shuffling'}
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                submitButtonName={'Create shuffling'}
            >
                <CreateShufflngForm ticker={this.props.ticker} />
            </ModalBody>

        );
    }
}

const mapStateToProps = state => ({
  ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateShuffling);
