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

class Settings extends React.Component {

    settingsLoaded = false;
    valuesSet = false;

    componentDidMount() {
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
        settings: null
    };

    getAccountInfoAction = async (props) => {
        console.log(props);
        const account = await this.props.getAccountInfoAction({account: props ? props.account : this.props.account});

        console.log(account);

        if (account) {
            console.log(account);

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

        const status =  await enable2FAActon({
            passphrase: values.passphrase,
            account:    values.account
        });

        if (status.errorCode) {
            NotificationManager.error(status.errorDescription, null, 5000);
        } else {
            this.props.setBodyModalParamsAction('CONFIRM_2FA_OPERATION', {
                ...status,
                passphrase: values.passphrase,
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

        const status =  await disable2FAActon({
            passphrase: values.passphrase,
            account:    values.account,
            code:       values.code
        });

        if (status.errorCode) {
            NotificationManager.error(status.errorDescription, null, 5000);
        } else {
            this.getAccountInfoAction();
            NotificationManager.success('2FA was successfully disabled.', null, 5000);
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

                            <React.Fragment>
                                <div className="page-settings-body">
                                    <div className="page-settings-item">
                                        <Form
                                            onSubmit={(values) => this.handleFormSubmit(values)}
                                            render={({submitForm, values, addValue, removeValue, getFormState}) => (
                                                <form className="modal-form" onSubmit={submitForm}>
                                                    <div className="form-group-app">
                                                        <div className="form-title">
                                                            <p>2FA</p>
                                                            {
                                                                !this.props.is2FA &&
                                                                <div className="form-sub-title">
                                                                    The 2FA currently disabled on this account. You can increase your wallet security with tthis option.
                                                                </div>
                                                            }
                                                            {
                                                                this.props.is2FA &&
                                                                <div className="form-sub-title">
                                                                    The 2FA currently enabled on this account.
                                                                </div>
                                                            }
                                                        </div>


                                                        {
                                                            this.state.account &&
                                                            !this.state.account.is2FA &&
                                                            <React.Fragment>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Account ID</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <Text className="form-control"
                                                                                  type="text"
                                                                                  field="account"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Pass phrase</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <Text className="form-control"
                                                                                  type="password"
                                                                                  field="passphrase"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-class form-group-grey row mb-15">
                                                                    <div
                                                                        style={{
                                                                            marginTop: 15,
                                                                            paddingLeft: 0
                                                                        }}
                                                                        className="col-sm-6 offset-sm-6"
                                                                    >
                                                                        <a className="no-margin btn static blue"
                                                                           onClick={() => this.getQRCode(getFormState)}>
                                                                            Get Qr code
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        }

                                                        {
                                                            this.state.account &&
                                                            this.state.account.is2FA &&
                                                            <React.Fragment>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Account ID</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <Text className="form-control"
                                                                                  type="text"
                                                                                  field="account"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Pass phrase</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <Text className="form-control"
                                                                                  type="password"
                                                                                  field="passphrase"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>2FA code</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <Text className="form-control"
                                                                                  type="password"
                                                                                  field="code"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-class form-group-grey row mb-15">
                                                                    <div
                                                                        style={{
                                                                            marginTop: 15,
                                                                            paddingLeft: 0
                                                                        }}
                                                                        className="col-sm-6 offset-sm-6"
                                                                    >
                                                                        <a className="no-margin btn static blue"
                                                                           onClick={() => this.disable2fa(getFormState)}>
                                                                            Confirm disable
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        }

                                                    </div>
                                                </form>
                                                )}
                                            />

                                    </div>
                                </div>
                            </React.Fragment>




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
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getSavedAccountSettings:   ()         => dispatch(getSavedAccountSettingsAction()),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getAccountInfoAction: (account) =>        dispatch(getAccountInfoAction(account))

});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);