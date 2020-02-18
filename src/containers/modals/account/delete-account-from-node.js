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
import util from "../../../helpers/util/utils";

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

    checkPermissionCallback = (status) => {
        if (!status.hasPermission) {
            const errorCallback = () => {
                console.warn('Storage permission is not turned on')
            };
            window.cordova.plugins.permissions.requestPermission(
                window.cordova.plugins.permissions.WRITE_EXTERNAL_STORAGE,
                (status) => {
                    if (!status.hasPermission) {
                        errorCallback();
                    } else {
                        this.writeFile();
                    }
                },
                errorCallback
            );
        } else {
            this.writeFile();
        }
    };

    downloadFile = () => {
        if (window.cordova && window.plugins) {
            let permissions = window.cordova.plugins.permissions;
            permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, this.checkPermissionCallback, null);
        }
        if (util.isDesktopApp() && window.java) {
            window.java.downloadFile(this.props.modalData[1].value.file, `${this.props.modalData[0].value}.apl`);
        }
    };

    writeFile = () => {
        const filename = `${this.props.modalData[0].value}.apl`;
        let base64 = `data:application/octet-stream;df:${filename};base64,${this.props.modalData[1].value.file}`;
        let subject = null;
        if (window.cordova.platformId === "android") {
            base64 = `data:application/;base64,${this.props.modalData[1].value.file}`;
            subject = filename;
        }
        const uri = encodeURI(base64);

        const options = {
            message: null,
            subject,
            files: [uri],
            url: null,
            chooserTitle: 'Export Account',
        };

        const onError = (msg) => {
            console.log("Downloading failed with message: " + msg);
            NotificationManager.error('Downloading Secret File failed', 'Error', 5000);
        };

        window.plugins.socialsharing.shareWithOptions(options, null, onError);
    };

    render() {
        return (
            <ModalBody
                modalTitle="Delete Account from this Web Node"
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
                        download={`${this.props.modalData[0].value}.apl`}
                        className="btn btn-green"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={this.downloadFile}
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
