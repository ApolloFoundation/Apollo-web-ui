/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../../containers/components/site-header'
import {connect} from "react-redux";
import {Form, Text, TextArea, Checkbox} from 'react-form';
import {getSavedAccountSettingsAction, saveAccountSettingsAction} from "../../../modules/accountSettings";
import CustomSelect from "../../components/select";
import {NotificationManager} from "react-notifications";
import store from '../../../store'
import './Settings.css';
import ContentLoader from '../../components/content-loader';
import {enable2FAActon, disable2FAActon} from '../../../actions/account'
import {setBodyModalParamsAction} from "../../../modules/modals";
import {getAccountInfoAction} from "../../../actions/account";
import {login} from '../../../modules/account'
import AccountRS from '../../components/account-rs';
import InputForm from '../../components/input-form';
import ModalFooter from '../../components/modal-footer';

class Settings extends React.Component {

    settingsLoaded = false;
    valuesSet = false;

    componentDidMount() {
        this.getAdminPassword();
        this.props.getSavedAccountSettings();
        this.getAccountInfoAction(this.props);
        this.settingsLoaded = true;

        if (this.state.settings) {
            this.setState({
                is2FA: true
            });
        } else {
            this.setState({
                is2FA: false
            });
        }
    }

    state = {
        settings: null,
        adminPassword: localStorage.getItem('adminPassword') ? JSON.parse(localStorage.getItem('adminPassword')) : ''
    };

    getAccountInfoAction = async (props) => {
        const account = await this.props.getAccountInfoAction({account: props ? props.account : this.props.account});

        if (account) {
            this.props.login(account);
            this.setState({
                account
            })
        }
    };

    handleSubmit = values => {
        saveAccountSettingsAction(values);
        getSavedAccountSettingsAction();
        NotificationManager.success('Settings has been saved!');
    };

    componentWillReceiveProps = (newState, oldState) => {
        this.getAccountInfoAction(newState);
        if(newState.settings !== oldState.settings){
            this.setState({
                settings: newState.settings
            });
        }
        if (this.state.settings) {
            this.setState({
                is2FA: true
            });
        } else {
            this.setState({
                is2FA: false
            });
        }
    };

    set2faStatus =(selectedOption) => {
        if (selectedOption.value) {
            this.setState({
                is2FA: true
            })
        } else {
            this.setState({
                is2FA: false
            })
        }
    };

    getQRCode = async (getFormState) => {
        const {values} = getFormState();

        if (!values.account) {
            NotificationManager.error('Account ID is not specified.', 'Error', 5000);
            return;
        } 

        const status =  await enable2FAActon({
            passphrase: values.secretPhrase,
            account:    values.account
        });

        if (status.errorCode) {
            NotificationManager.error(status.errorDescription, null, 5000);
        } else {
            this.props.setBodyModalParamsAction('CONFIRM_2FA_OPERATION', {
                ...status,
                passphrase: values.secretPhrase,
                account:    values.account,
                operation: 'enable 2FA',
                settingsReloader: this.getAccountInfoAction
            })

            this.setState({
                info2fa: status
            })
        }
    };

    disable2fa = async (getFormState) => {
        const {values} = getFormState();

        if (!values.account) {
            NotificationManager.error('Account ID is not specified.', 'Error', 5000);
            return;
        } 

        const status =  await disable2FAActon({
            passphrase: values.secretPhrase,
            account:    values.account,
            code2FA:       values.code2FA
        });

        if (status.errorCode) {
            NotificationManager.error(status.errorDescription, null, 5000);
        } else {
            this.getAccountInfoAction();
            NotificationManager.success('2FA was successfully disabled.', null, 5000);
        }
    };

    getAdminPassword = () => {
        const adminPassword = localStorage.getItem('adminPassword');

        if (adminPassword) {
            this.setState({
                adminPassword: JSON.parse(adminPassword)
            });
        }
    };

    handleGeneralSettingFormSubmit = (values) => {
        const adminPassword = JSON.stringify(values.adminPassword);

        if (adminPassword) {
            localStorage.setItem('adminPassword', adminPassword);
            NotificationManager.success('Admin password has been successfully saved!', null, 5000);
        }
    };

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Settings'}
                />
                <div className="page-body container-fluid">
                    <div className="account-settings" style={{padding: 0}}>
                        <div className="row" style={{padding: 0, width: '100%'}}>

                            <div className="page-settings-body">
                                <div className="page-settings-item">
                                    <Form
                                        onSubmit={(values) => this.handleFormSubmit(values)}
                                        render={({submitForm, setValue, values, addValue, removeValue, getFormState}) => (
                                            <form className="modal-form" onSubmit={submitForm}>
                                                <div className="form-group-app">
                                                    <div className="form-title">
                                                        <p>Two Factor Authentication (2FA)</p>
                                                        {
                                                            !this.props.is2FA &&
                                                            <div className="form-sub-title">
                                                                The 2FA currently disabled on this account. You can increase your wallet security with this option.
                                                            </div>
                                                        }
                                                        {
                                                            this.props.is2FA &&
                                                            <div className="form-sub-title">
                                                                The 2FA currently enabled on this account.
                                                            </div>
                                                        }
                                                    </div>
                                                    
                                                    <div className="input-group-app form-group mb-15 display-block inline user">
                                                        <div className="row form-group-white">
                                                            <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                                Account ID
                                                            </label>
                                                            <div className="col-sm-9">
                                                                <AccountRS
                                                                    value={''}
                                                                    noContactList={true}
                                                                    placeholder="Account ID"
                                                                    setValue={setValue}
                                                                    field={'account'}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ModalFooter
                                                        setValue={setValue}
                                                    />
                                                    <div className="mobile-class form-group-grey row mb-15">
                                                        <div
                                                            style={{
                                                                marginTop: 15,
                                                            }}
                                                            className="col-sm-6 offset-sm-3"
                                                        >
                                                            {
                                                                this.state.account &&
                                                                !this.state.account.is2FA &&
                                                                <button
                                                                    type={'button'}
                                                                    className="no-margin btn static blue"
                                                                    onClick={() => this.getQRCode(getFormState)}
                                                                >
                                                                    Get Qr code
                                                                </button>
                                                            }
                                                            {
                                                                this.state.account &&
                                                                this.state.account.is2FA &&
                                                                <button
                                                                    type={'button'}
                                                                    className="no-margin btn static blue"
                                                                    onClick={() => this.disable2fa(getFormState)}
                                                                >
                                                                    Confirm disable
                                                                </button>
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            )}
                                        />

                                </div>
                                {
                                    this.props.isLocalhost &&
                                    <div className="page-settings-item full-height">
                                        <Form
                                            onSubmit={(values) => this.handleGeneralSettingFormSubmit(values)}
                                            render={({submitForm, setValue, values, addValue, removeValue, getFormState}) => (
                                                <form className="modal-form" onSubmit={submitForm}>
                                                    <div className="form-group-app">
                                                        <div className="form-title">
                                                            <p>General</p>
                                                        </div>
                                                        <div className="form-group row form-group-white mb-15">
                                                            <label className="col-sm-3 col-form-label">
                                                                Admin password
                                                            </label>
                                                            <div className="col-sm-9">

                                                                <InputForm
                                                                    isPlain
                                                                    type="password"
                                                                    field="adminPassword"
                                                                    placeholder="Admin password"
                                                                    setValue={setValue}
                                                                    defaultValue={this.state.adminPassword}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row form-group-white mb-15">
                                                            <div className="mobile-class form-group-grey row mb-15">
                                                                <div
                                                                    style={{
                                                                        marginTop: 15,
                                                                    }}
                                                                    className="col-sm-6 offset-sm-3"
                                                                >
                                                                    <button className="no-margin btn static blue">
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            )}
                                        />

                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    settings: state.accountSettings,
    is2FA: state.account.is2FA,
    account: state.account.account,
    isLocalhost: state.account.isLocalhost
});

const mapDispatchToProps = dispatch => ({
    getSavedAccountSettings:   () =>           dispatch(getSavedAccountSettingsAction()),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getAccountInfoAction: (account) =>        dispatch(getAccountInfoAction(account)),
    login: (account) =>                       dispatch(login(account))

});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);