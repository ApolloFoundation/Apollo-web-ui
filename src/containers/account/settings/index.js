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

class Settings extends React.Component {

    settingsLoaded = false;
    valuesSet = false;

    componentDidMount() {
        this.props.getSavedAccountSettings();
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

    handleSubmit = values => {
        saveAccountSettingsAction(values);
        getSavedAccountSettingsAction();
        NotificationManager.success('Settings has been saved!');
    };

    componentWillReceiveProps = (newState, oldState) => {
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

    optionsYesNo = [
        {
            label: "Yes",
            value: true
        },
        {
            label: "No",
            value: false
        }
    ];

    colorsOptions = [
        {
            label: "Default",
            value: '#F5F5F5'
        },
        {
            label: "Green",
            value: 'green'
        },
        {
            label: "Red",
            value: 'red'
        },
        {
            label: "Brown",
            value: 'brown'
        },
        {
            label: "Purple",
            value: 'purple'
        },
        {
            label: "Gray",
            value: 'gray'
        },
        {
            label: "Pink",
            value: 'pink'
        },
        {
            label: "Bright blue",
            value: 'bright-blue'
        },
        {
            label: "Dark blue",
            value: 'dark-blue'
        },

    ];

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
                operation: 'enable 2FA'
            })

            this.setState({
                info2fa: status
            })
        }
    }

    disable2fa = async (getFormState) => {
        const {values} = getFormState();

        const status =  await disable2FAActon({
            passphrase: values.passphrase,
            account:    values.account,
            code:       values.code
        });

        if (status.errorCode) {
            NotificationManager.error('pizdec', null, 5000);
        } else {
            NotificationManager.success('ok', null, 5000);
        }
    }

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Settings'}
                />
                <div className="page-body container-fluid">
                    <div className="account-settings" style={{padding: 0}}>
                        <div className="row" style={{padding: 0, width: '100%'}}>
                            <Form
                                onSubmit={values => this.handleSubmit(values)}
                                render={({submitForm, setAllValues, setValue, getFormState}) => {
                                    if (this.settingsLoaded) {
                                        if (!this.valuesSet) {
                                            setAllValues(this.props.settings);
                                            this.valuesSet = true;
                                        }
                                    }
                                    return (
                                        <form onSubmit={submitForm} style={{width: '100%', padding: 0}}>
                                            {
                                                this.state.settings &&
                                                <React.Fragment>
                                                    <div className="page-settings-body">
                                                        <div className="page-settings-item">
                                                            <div className="form-group-app">
                                                                <div className="form-title">
                                                                    <p>General</p>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Language</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                field="language"
                                                                                options={this.optionsYesNo}
                                                                                setValue={setValue}
                                                                                defaultValue={{ value: this.state.settings.language,     label: this.state.settings.language }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Regional format</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                field="regFormat"
                                                                                options={this.optionsYesNo}
                                                                                setValue={setValue}
                                                                                values={this.state.settings.language}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Use 24 hour format</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                field="use24h"
                                                                                options={this.optionsYesNo}
                                                                                setValue={setValue}
                                                                                defaultValue={{
                                                                                    value: this.state.settings.use24h,
                                                                                    label: this.state.settings.use24h ? 'Yes' : 'No'
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Maximum decimal positions</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                field="maxDecimals"
                                                                                setValue={setValue}
                                                                                options={[
                                                                                    {label:"0", value: 0},
                                                                                    {label:"1", value: 1},
                                                                                    {label:"2", value: 2},
                                                                                    {label:"3", value: 3},
                                                                                    {label:"4", value: 4},
                                                                                    {label:"5", value: 5},
                                                                                    {label:"6", value: 6},
                                                                                    {label:"7", value: 7},
                                                                                    {label:"8", value: 8},
                                                                                ]}
                                                                                defaultValue={{
                                                                                    value: this.state.settings.maxDecimals,
                                                                                    label: this.state.settings.maxDecimals
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="page-settings-item">
                                                            <div className="form-group-app">
                                                                <div className="form-title">
                                                                    <p>User interface behaviour</p>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Submit forms on enter</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                field="submitFormsEnter"
                                                                                options={this.optionsYesNo}
                                                                                setValue={setValue}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Enable marketplace section</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                options={this.optionsYesNo}
                                                                                field="marketplaceSelection"
                                                                                setValue={setValue}
                                                                                defaultValue={{
                                                                                    value: this.state.settings.marketplaceSelection,
                                                                                    label: this.state.settings.marketplaceSelection ? 'Yes' : 'No'
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Enable exchange section</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                options={this.optionsYesNo}
                                                                                field="exchangeSection"
                                                                                setValue={setValue}
                                                                                defaultValue={{
                                                                                    value: this.state.settings.exchangeSection,
                                                                                    label: this.state.settings.exchangeSection ? 'Yes' : 'No'
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Animate forging indicator</label>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <CustomSelect
                                                                                options={this.optionsYesNo}
                                                                                field="animateForging"
                                                                                setValue={setValue}
                                                                                defaultValue={{
                                                                                    value: this.state.settings.animateForging,
                                                                                    label: this.state.settings.animateForging ? 'Yes' : 'No'
                                                                                }}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/*<div className="input-group-app">*/}
                                                                    {/*<div className="row">*/}
                                                                        {/*<div className="col-md-6 align-items-center">*/}
                                                                            {/*<label>Items to show per page</label>*/}
                                                                        {/*</div>*/}
                                                                        {/*<div className="col-md-6">*/}
                                                                            {/*<CustomSelect*/}
                                                                                {/*field="itemsToShow"*/}
                                                                                {/*setValue={setValue}*/}

                                                                                {/*options={[*/}
                                                                                    {/*{label:"10", value: 10},*/}
                                                                                    {/*{label:"15", value: 15},*/}
                                                                                    {/*{label:"20", value: 20},*/}
                                                                                    {/*{label:"25", value: 25},*/}
                                                                                    {/*{label:"30", value: 30},*/}
                                                                                    {/*{label:"35", value: 35},*/}
                                                                                    {/*{label:"40", value: 40},*/}
                                                                                    {/*{label:"45", value: 45},*/}
                                                                                    {/*{label:"50", value: 50},*/}
                                                                                {/*]}*/}
                                                                            {/*/>*/}
                                                                        {/*</div>*/}
                                                                    {/*</div>*/}
                                                                {/*</div>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="page-settings-body">
                                                        <div className="page-settings-item">
                                                            <div className="form-group-app">
                                                                <div className="form-title">
                                                                    <p>Form warnings</p>
                                                                    <div className="form-sub-title">Show a warning when an amount /
                                                                        fee entered is
                                                                        higher than specified below.
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Max amount warning</label>
                                                                        </div>
                                                                        <div className="col-md-6 input-group input-group-text-transparent">
                                                                            <Text type="number"
                                                                                  className="form-control"
                                                                                  field="maxAmountWarn"
                                                                                  aria-describedby="maxAmountWarnText" />
                                                                            <div className="input-group-append">
                                                                                <span className="input-group-text" id="maxAmountWarnText">Apollo</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Max fee warning</label>
                                                                        </div>
                                                                        <div className="col-md-6 input-group input-group-text-transparent">
                                                                            <Text className="form-control"
                                                                                  type="number"
                                                                                  field="maxFeeWarn"/>
                                                                            <div className="input-group-append">
                                                                                <span className="input-group-text">Apollo</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Max asset transfer warning</label>
                                                                        </div>
                                                                        <div className="col-md-6 input-group input-group-text-transparent">
                                                                            <Text className="form-control"
                                                                                  type="number"
                                                                                  field="maxAssetWarn"/>
                                                                            <div className="input-group-append">
                                                                                <span className="input-group-text">Apollo</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-app">
                                                                    <div className="row">
                                                                        <div className="col-md-6 align-items-center">
                                                                            <label>Max currency transfer warning</label>
                                                                        </div>
                                                                        <div className="col-md-6 input-group input-group-text-transparent">
                                                                            <Text className="form-control"
                                                                                  type="number"
                                                                                  field="maxCurrencyWarn"/>
                                                                            <div className="input-group-append">
                                                                                <span className="input-group-text">Units</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="page-settings-item">
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
                                                                    !this.props.is2FA &&
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
                                                                    this.props.is2FA &&
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
                                                                                    <label>Pass phrase</label>
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
                                                                                    Get Qr code
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </React.Fragment>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            }

                                            {/*<div className="page-settings-body">
                                                <div className="page-settings-item">
                                                    <div className="form-group-app">
                                                        <div className="form-title">
                                                            <p>Exchange settings</p>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>ShapeShift URL</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input type="select"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>ShapeShift API Key</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input type="select"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Changelly URL</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input type="select"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Changelly URL</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input type="select"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Changelly API Secret</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input type="select"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>*/}
                                            <div className="row">
                                                <div className="col-md-12 text-right">
                                                    <div className="page-settings-item">
                                                        <div className="btn-box right-conner more-padding">
                                                            <a onClick={() => this.props.closeModal()}
                                                               className="btn primary">Cancel</a>
                                                            <button type="submit" className="btn primary blue">Save settings</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>)
                                }}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    settings: state.accountSettings,
    is2FA: state.account.is2FA
});

const mapDispatchToProps = dispatch => ({
    getSavedAccountSettings:   ()         => dispatch(getSavedAccountSettingsAction()),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);