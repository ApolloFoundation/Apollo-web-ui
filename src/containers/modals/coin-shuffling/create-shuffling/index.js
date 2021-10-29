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
import CreateShufflngForm from './form';
import {NotificationManager} from "react-notifications";

const holdingTypeData = [
    { value: 0, label: 'Apollo' },
    { value: 1, label: 'Asset' },
    { value: 2, label: 'Currency' },
];

class CreateShuffling extends React.Component {
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
        }

    }

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
                loadForm={this.loadForm}
                modalTitle={'Create shuffling'}
                isAdvanced
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
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
