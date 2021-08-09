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
} from "../../../modules/modals";
import crypto from '../../../helpers/crypto/crypto';
import submitForm from "../../../helpers/forms/forms";
import util from "../../../helpers/util/utils";
import {getAccountDataAction} from "../../../actions/login";
import {exportAccount} from '../../../actions/account';
import InfoBox from '../../components/info-box';
import ModalBody from "../../components/modals/modal-body";
import AccountRSFormInput from "../../components/form-components/account-rs";
import TextualInputComponent from "../../components/form-components/textual-input";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    account: state.account.accountRS,
    is2fa: state.account.is2FA,
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
    exportAccount: (reqParams) => dispatch(exportAccount(reqParams)),
});

class ExportAccount extends React.Component {
    downloadSecretFile = React.createRef();
    state = {
        accountKeySeedData: null,
    };

    handleFormSubmit = async (values) => {
        const accountKeySeedData = await this.props.exportAccount(values);

        if (accountKeySeedData) {
            if (!accountKeySeedData.errorCode && accountKeySeedData.file) {
                this.setState({
                    accountKeySeedData: {
                        ...accountKeySeedData,
                        account: values.account,
                    }
                }, async () => {
                    const base64 = `data:application/octet-stream;base64,${accountKeySeedData.file}`;
                    this.downloadSecretFile.current.href = encodeURI(base64);
                    this.setState({
                        accountKeySeedData: {
                            ...this.state.accountKeySeedData,
                            href: this.downloadSecretFile.current.href
                        }
                    });
                    if (util.isDesktopApp() && window.java) {
                        window.java.downloadFile(accountKeySeedData.file, `${values.account}.apl`);
                    } else {
                        this.downloadSecretFile.current.click();
                    }
                });
            } else {
                NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
            }
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
            window.java.downloadFile(this.state.accountKeySeedData.file, `${this.state.accountKeySeedData.account}.apl`);
        }
    };

    writeFile = () => {
        const filename = `${this.state.accountKeySeedData.account}.apl`;
        let base64 = `data:application/octet-stream;df:${filename};base64,${this.state.accountKeySeedData.file}`;
        let subject = null;
        if (window.cordova.platformId === "android") {
            base64 = `data:application/;base64,${this.state.accountKeySeedData.file}`;
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

    componentDidCatch(error, info) {
        this.setState({hasError: true});
    };

    render() {
        return (
            <ModalBody
                modalTitle={'Export Account'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                isDisableSecretPhrase
                submitButtonName={!this.state.accountKeySeedData && 'Export'}
            >
                <InfoBox className={'light-info'}>
                    <ul className={'marked-list'}>
                        <li className={'danger-icon'}>
                            <strong>Attention!</strong><br/>
                            Please, check your wallets to make sure there are no funds on them. Deleting a key from the
                            node may lead to the loss of all funds.
                        </li>
                    </ul>
                </InfoBox>
                <AccountRSFormInput
                    field={'account'}
                    label={'Account ID'}
                    placeholder={'Account ID'}
                />
                <TextualInputComponent
                    label={'Secret phrase'}
                    field="passPhrase"
                    placeholder="Secret phrase"
                    type={"password"}
                />
                {this.props.is2fa && (
                    <TextualInputComponent
                        label={'2FA code'}
                        field="code2FA"
                        placeholder="2FA code"
                        type={"password"}
                    />
                )}
                {this.state.accountKeySeedData && (
                    <React.Fragment>
                        <InfoBox attentionLeft>
                            <p className={'mb-3'}>
                                Account ID: <span className={'itatic'}>{this.state.accountKeySeedData.account}</span>
                            </p>
                            <a
                                ref={this.downloadSecretFile}
                                href={''}
                                download={`${this.state.accountKeySeedData.account}.apl`}
                                className="btn btn-green"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={this.downloadFile}
                            >
                                Download Secret File
                            </a>
                        </InfoBox>
                        <InfoBox info nowrap>
                            You can delete your account data from this web node completely.
                            If you delete this account data you will need to import this secret key to
                            login again.
                            <br/>
                            Do you want to delete it?
                            <br/>
                            <button
                                type={'button'}
                                style={{marginTop: 18, marginRight: 18}}
                                onClick={() => this.props.setBodyModalParamsAction('DELETE_ACCOUNT_FROM_NODE', [
                                    {
                                        value: this.props.account,
                                        name: 'Account ID'
                                    },
                                    {
                                        value: this.state.accountKeySeedData,
                                        name: 'Secret File'
                                    }
                                ])}
                                className={'btn btn-danger'}
                            >
                                Yes
                            </button>
                            <button
                                type={'button'}
                                style={{marginTop: 18}}
                                onClick={() => this.props.closeModal()}
                                className={'btn btn-green'}
                            >
                                No
                            </button>

                        </InfoBox>
                    </React.Fragment>
                )}
            </ModalBody>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportAccount);
