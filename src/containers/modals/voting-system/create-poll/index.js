/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import submitForm from "../../../../helpers/forms/forms";

import {handleFormSubmit} from './handleFormSubmit';

import ModalBody from '../../../components/modals/modal-body';

import PollForm from './form';
// TODO update
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

    handleFormSubmit = async(values) => handleFormSubmit.call(this.props, values)

    render() {
        const {nameModal, ticker} = this.props;

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
                <PollForm ticker={ticker} />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    ticker: state.account.ticker,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll);
