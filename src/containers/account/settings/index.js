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

import './Settings.css';

class Settings extends React.Component {

    settingsLoaded = false;
    valuesSet = false;

    componentDidMount() {
        this.props.getSavedAccountSettings();
        this.settingsLoaded = true;
    }

    handleSubmit = values => {
        saveAccountSettingsAction(values);
        NotificationManager.success('Settings has been saved!');
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
                                render={({submitForm, setAllValues, setValue}) => {
                                    if (this.settingsLoaded) {
                                        if (!this.valuesSet) {
                                            setAllValues(this.props.settings);
                                            this.valuesSet = true;
                                        }
                                    }
                                    return (
                                        <form onSubmit={submitForm} style={{width: '100%', padding: 0}}>
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
                                                                        setValue={setValue}
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
                                                                        setValue={setValue}
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
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Enable plugins</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <CustomSelect
                                                                        options={this.optionsYesNo}
                                                                        field="enablePlugins"
                                                                        setValue={setValue}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <label></label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-sub-title">Need restart of
                                                                        client.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Show console log button</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <CustomSelect
                                                                        field="showConsoleButton"
                                                                        options={this.optionsYesNo}
                                                                        setValue={setValue}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Administrator password</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <Text field="adminPass" className="form-control" type="password"/>
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
                                                                <div className="col-md-6">
                                                                    <label></label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-sub-title">Be careful when choosing
                                                                        to submit forms
                                                                        via the enter key, submitting can't be undone.
                                                                    </div>
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

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Items to show per page</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <CustomSelect
                                                                        field="itemsToShow"
                                                                        setValue={setValue}

                                                                        options={[
                                                                            {label:"10", value: 10},
                                                                            {label:"15", value: 15},
                                                                            {label:"20", value: 20},
                                                                            {label:"25", value: 25},
                                                                            {label:"30", value: 30},
                                                                            {label:"35", value: 35},
                                                                            {label:"40", value: 40},
                                                                            {label:"45", value: 45},
                                                                            {label:"50", value: 50},
                                                                        ]}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                                        <span className="input-group-text">QNT</span>
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
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Show fake warnings</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <CustomSelect
                                                                        field="showFakeWarns"
                                                                        options={this.optionsYesNo}
                                                                        setValue={setValue}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="page-settings-item">
                                                    <div className="form-group-app">
                                                        <div className="form-title">
                                                            <p>Theme settings</p>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Header</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <CustomSelect
                                                                        field="header"
                                                                        setValue={setValue}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Sidebar</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <CustomSelect
                                                                        field="sidebar"
                                                                        setValue={setValue}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="input-group-app">
                                                            <div className="row">
                                                                <div className="col-md-6 align-items-center">
                                                                    <label>Boxes</label>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <CustomSelect
                                                                        field="boxes"
                                                                        setValue={setValue}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
});

const mapDispatchToProps = dispatch => ({
    getSavedAccountSettings:   ()         => dispatch(getSavedAccountSettingsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);