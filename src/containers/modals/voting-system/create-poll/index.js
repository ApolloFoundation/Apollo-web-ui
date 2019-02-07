/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import submitForm from "../../../../helpers/forms/forms";
import {getBlockAction} from "../../../../actions/blocks";
import {getCurrencyAction} from "../../../../actions/currencies";
import {getAssetAction} from "../../../../actions/assets";
import {NotificationManager} from "react-notifications";
import {calculateFeeAction} from "../../../../actions/forms";
import crypto from "../../../../helpers/crypto/crypto";

import {handleFormSubmit} from './handleFormSubmit';

import ModalBody from '../../../components/modals/modal-body';

import PollForm from './form';

class CreatePoll extends React.Component {
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

            currency: '-',
            asset: 'Not Existing',
        }
    }

    handleFormSubmit = async(values) => this.props.handleFormSubmit(values)


    handleVotingModel = (value, setValue) => {
        if (value !== 0) setValue('minBalanceType', 0);
        setValue('minBalanceModel', value);
    };

    render() {
        const {nameModal} = this.props;

        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={'Create Poll'}
                isAdvanced={true}
                isFee
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Create'}
                nameModel={nameModal}
				idGroup={'create-poll-modal-'}
            >
                <PollForm />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    handleFormSubmit: (values) => dispatch(handleFormSubmit(values)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll);
