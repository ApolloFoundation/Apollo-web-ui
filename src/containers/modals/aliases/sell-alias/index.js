/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';

import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";

import SellAliasForm from './form';
import ModalBody from '../../../components/modals/modal-body';

class SellAlias extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
        };

    }

    async handleFormSubmit(values) {

        values = {
            ...values,
            aliasName: this.state.alias.aliasName,

        };

        this.props.processForm(values, 'sellAlias', 'Alias has been listed!', () => {
            this.props.setBodyModalParamsAction(null, {});
            NotificationManager.success('Alias has been listed!', null, 5000);
        });
    }

    render() {
        return (
            <ModalBody
                modalTitle={'Sell Alias'}
                isAdvanced={true}
            >
                <SellAliasForm 
                    closeModal={this.props.closeModal} 
                    handleFormSubmit={this.handleFormSubmit} 
                />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellAlias);
