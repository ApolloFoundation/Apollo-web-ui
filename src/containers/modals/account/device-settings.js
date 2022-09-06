/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import classNames from 'classnames';

import {Form, Text, TextArea, Checkbox} from 'react-form';
import InputForm from '../../components/input-form';
import crypto from "../../../helpers/crypto/crypto";
import submitForm from "../../../helpers/forms/forms";
import {getSavedSettingsAction, saveSettingsAction} from "../../../modules/settings";
import {NotificationManager} from "react-notifications";

class DeviceSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    valuesSet = false;
    settingsLoaded = false;

    componentDidMount() {
        this.props.loadSavedSettings();
        this.settingsLoaded = true;
    }

    handleFormSubmit(values) {
        this.setState({
            isPending: true
        })
        this.props.saveSettings(values);
        this.props.setBodyModalParamsAction(null, {});
        NotificationManager.success('Settings has been saved!', null, 5000);
    }

    handleTabChange(tab) {
        this.setState({
            activeTab: tab
        })
    }

    handleAdvancedState() {
        if (this.state.advancedState) {
            this.setState({
                advancedState: false
            })
        } else {
            this.setState({
                advancedState: true
            })
        }
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 setValue, submitForm, setAllValues
                             }) => {
                        if (this.settingsLoaded) {
                            if (!this.valuesSet) {
                                setAllValues(this.props.settings);
                                this.valuesSet = true;
                            }
                        }
                        return (
                            <form className="modal-form" onSubmit={submitForm}>
                                <div className="form-group-app">
                                    <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></button>
                                    <div className="form-title">
                                        <p>Device Settings</p>
                                        <div className="form-sub-title">
                                            Remote Node URL
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label align-self-start">
                                            Settings
                                        </label>
                                        <div className="col-sm-9">
                                            <div className="form-check custom-checkbox mb-15">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="is_check_remember_me"/>
                                                <label className="form-check-label custom-control-label">
                                                    Check remember me checkbox
                                                </label>
                                            </div>
                                            <div className="form-check custom-checkbox mb-15">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="is_store_remembered_passphrase"/>
                                                <label className="form-check-label custom-control-label">
                                                    Store remembered secret phrase
                                                </label>
                                            </div>
                                            <div className="form-check custom-checkbox mb-15">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="is_simulate_app"/>
                                                <label className="form-check-label custom-control-label">
                                                    Simulate mobile app
                                                </label>
                                            </div>
                                            <div className="form-check custom-checkbox">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="is_testnet"/>
                                                <label className="form-check-label custom-control-label">
                                                    Connect to Testnet
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Remote node address
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="remote_node_address"
                                                placeholder=""
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Remote node port
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="remote_node_port"
                                                placeholder=""
                                                type="number"
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="mobile-class row mb-15 form-group-white">
                                        <div className="col-md-9 offset-md-3">
                                            <div className="form-check custom-checkbox">
                                                <Checkbox className="form-check-input custom-control-input"
                                                          type="checkbox"
                                                          field="is_remote_node_ssl"/>
                                                <label className="form-check-label custom-control-label">
                                                    Use https
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Number of data validators
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="validators_count"
                                                placeholder=""
                                                type="number"
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Number of bootstrap nodes
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                field="bootstrap_nodes_count"
                                                type="number"
                                                placeholder=""
                                                setValue={setValue}/>
                                        </div>
                                    </div>

                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        {
                                            !!this.state.isPending ?
                                                <div
                                                    style={{
                                                        width: 38.25
                                                    }}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    <div className="ball-pulse">
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                </div> :
                                                <button

                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Set
                                                </button>
                                        }

                                        <button
                                            type={'button'}
                                            onClick={() => this.props.closeModal()}
                                            className="btn btn-right round round-top-left">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                >

                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    loadSavedSettings: () => dispatch(getSavedSettingsAction()),
    saveSettings: settings => dispatch(saveSettingsAction(settings)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSettings);
