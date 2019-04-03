/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {Text} from 'react-form';
import InfoBox from '../../components/info-box';
import crypto from '../../../helpers/crypto/crypto';
import {
    openPrevModal,
    saveSendModalState,
    setAlert,
    setBodyModalParamsAction,
    setModalData
} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import {base64ToBlob} from "../../../helpers/format";
import {getAccountDataAction} from "../../../actions/login";
import {exportAccount} from '../../../actions/account';
import BackForm from '../modal-form/modal-form-container';

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
    constructor(props) {
        super(props);
        this.downloadSecretFile = React.createRef();
    };

    handleFormSubmit = async (values) => {
        const accountKeySeedData = await this.props.exportAccount(values);

        if (accountKeySeedData) {
            if (!accountKeySeedData.errorCode && accountKeySeedData.file) {
                this.setState({accountKeySeedData}, async () => {
                    this.downloadSecretFile.current.download = values.account;
                    const blobFile = await base64ToBlob(accountKeySeedData.file);
                    this.downloadSecretFile.current.href = window.URL.createObjectURL(blobFile);
                    this.setState({accountKeySeedData: {href: this.downloadSecretFile.current.href}});
                    this.downloadSecretFile.current.click();
                });
            } else {
                NotificationManager.error(accountKeySeedData.errorDescription, 'Error', 5000);
            }
        }
    };

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
        // You can also log the error to an error reporting service
    };

    render() {
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({setValue, submitForm, values, addValue, removeValue, getFormState}) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)}
                              onSubmit={submitForm}>

                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => {
                                        this.props.openPrevModal()
                                    }}/>
                                    }
                                    <p>Export Account</p>
                                </div>
                                <InfoBox danger>
                                    Please, check your wallets to make sure there are no funds on them. Deleting a key
                                    from the node may lead to funds loss.
                                </InfoBox>

                                <div className="form-group row form-group-grey mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Account ID
                                    </label>
                                    <div className="col-sm-9">
                                        <Text
                                            className="form-control"
                                            placeholder="Account ID"
                                            field="account"
                                        />
                                    </div>
                                </div>

                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Secret phrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                    </label>
                                    <div className="col-sm-9">
                                        <Text
                                            className={'form-control'}
                                            type="password"
                                            field="passPhrase"
                                            placeholder="Secret Phrase"/>
                                    </div>
                                </div>
                                {
                                    this.props.is2fa &&
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            2FA code
                                        </label>
                                        <div className="col-sm-9">
                                            <Text
                                                type="password"
                                                field="code2FA"
                                                placeholder="2FA code"
                                            />
                                        </div>
                                    </div>
                                }

                                {this.state && this.state.accountKeySeedData ?
                                    <React.Fragment>
                                        <InfoBox attentionLeft>
                                            Account ID: <span className={'itatic'}>{this.props.account}</span>
                                            <br/>
                                            <br/>
                                            <a
                                                ref={this.downloadSecretFile}
                                                className="btn blue static"
                                                target="_blank"
                                            >
                                                Download Secret File
                                            </a>
                                        </InfoBox>
                                        <InfoBox info nowrap>
                                            You can delete your account data from this web node completely.
                                            If you delete this account data you will need to import this secret key to
                                            login again.
                                            <br/>
                                            Do you wish to delete it?
                                            <br/>
                                            <a
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
                                                className={'btn danger static'}
                                            >
                                                Yes
                                            </a>
                                            <a
                                                style={{marginTop: 18}}
                                                onClick={() => this.props.closeModal()}
                                                className={'btn success static'}
                                            >
                                                No
                                            </a>

                                        </InfoBox>
                                    </React.Fragment>
                                    :
                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                        >
                                            Export
                                        </button>
                                    </div>
                                }
                            </div>
                        </form>
                    )}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportAccount);
