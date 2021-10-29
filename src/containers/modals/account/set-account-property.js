/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {openPrevModal, saveSendModalState, setBodyModalParamsAction, setModalData} from '../../../modules/modals';

import submitForm from "../../../helpers/forms/forms";
import crypto from "../../../helpers/crypto/crypto";
import ModalBody from "../../components/modals/modal-body";
import SetAccountPropertyForm from "./set-account-property-form";

class SetAccountProperty extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,
            isPending: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    async handleFormSubmit(values) {
        if (!this.state.isPending) {
            this.setState({isPending: true});
            const {modalData, submitForm} = this.props;

            // Check if the property is already passed to modal window
            if (modalData && modalData.property) {
                values.property = modalData.property;
            }

            const res = await submitForm(values, 'setAccountProperty');
            if (res.errorCode) {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            } else {
                this.props.setBodyModalParamsAction(null, {});
                NotificationManager.success('Account property has been saved!', null, 5000);
            }
            this.setState({isPending: false});
        }
    }

    render() {
        return (
            <ModalBody
                modalTitle={`${this.props.modalData.property ? 'Update' : 'Set'} Account Property`}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Set Property'}
                isFee
                idGroup={'set-account-property-'}
            >
                <SetAccountPropertyForm/>
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetAccountProperty);
