/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {
    openPrevModal,
    saveSendModalState,
    setAlert,
    setBodyModalParamsAction,
    setModalData
} from '../../../modules/modals';
import crypto from '../../../helpers/crypto/crypto';
import submitForm from "../../../helpers/forms/forms";
import {getAccountDataAction} from "../../../actions/login";
import {removeAccountAction} from '../../../actions/account';
import InfoBox from '../../components/info-box';
import ModalBody from "../../components/modals/modal-body";
import AccountRSFormInput from "../../components/form-components/account-rs";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getAccountDataAction: (reqParams) => dispatch(getAccountDataAction(reqParams)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

class DeleteAccountFromWebNode extends React.Component {

    handleFormSubmit = async (values) => {
        const accountKeySeedData = await removeAccountAction(values);

        if (accountKeySeedData && !accountKeySeedData.errorCode) {
            NotificationManager.success('Your account was successfully removed from this web node.', null, 5000);
            this.props.closeModal();

        } else {
            NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
        }
    };

    componentDidCatch(error, info) {
        this.setState({hasError: true});
    }

    render() {
        return (
            <ModalBody
                modalTitle={'Delete Account from this Web Node'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={'Delete'}
            >
                <InfoBox attentionLeft>
                    <p className={'mb-3'}>
                        Account ID: <span className={'itatic'}>{this.props.modalData[0].value}</span>
                    </p>
                    <a
                        href={this.props.modalData[1].value.href}
                        download={this.props.modalData[0].value}
                        className="btn btn-green"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Secret File
                    </a>
                </InfoBox>
                <InfoBox className={'light-info'}>
                    <ul className={'marked-list'}>
                        <li className={'danger-icon'}>
                            <strong>Attention!</strong><br/>
                            Make a backup of your secret file. You will lose access to your account and funds if
                            you do not have a backup.
                        </li>
                    </ul>
                </InfoBox>
                <AccountRSFormInput
                    field={'account'}
                    label={'Account ID'}
                    placeholder={'Account ID'}
                />
            </ModalBody>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountFromWebNode);
