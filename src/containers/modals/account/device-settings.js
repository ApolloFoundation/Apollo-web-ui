import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import classNames from 'classnames';

import {Form, Text, TextArea, Checkbox} from 'react-form';
import InfoBox from '../../components/info-box';
import crypto from "../../../helpers/crypto/crypto";
import submitForm from "../../../helpers/forms/forms";
import {getSavedSettingsAction, saveSettingsAction} from "../../../modules/settings";

class DeviceSettings extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    valuesSet = false;
    settingsLoaded = false;

    componentDidMount() {
        this.props.loadSavedSettings();
        this.settingsLoaded = true;
    }

    async handleFormSubmit(values) {
        this.props.saveSettings(values);
    }

    handleTabChange(tab) {
        this.setState({
            ...this.props,
            activeTab: tab
        })
    }

    handleAdvancedState() {
        if (this.state.advancedState) {
            this.setState({
                ...this.props,
                advancedState: false
            })
        } else {
            this.setState({
                ...this.props,
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
                                 submitForm, setAllValues
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
                                    <a onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></a>

                                    <div className="form-title">
                                        <p>Device Settings</p>
                                    </div>
                                    <div className="input-group-app offset-top display-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Settings</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="input-wrapper">
                                                    <div
                                                        className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox style={{display: 'inline-block'}} type="checkbox"
                                                                  field="is_check_remember_me"/>
                                                        <label style={{display: 'inline-block'}}>Check remember me
                                                            checkbox</label>
                                                    </div>
                                                    <div
                                                        className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox style={{display: 'inline-block'}} type="checkbox"
                                                                  field="is_store_remembered_passphrase"/>
                                                        <label style={{display: 'inline-block'}}>Store remembered
                                                            passphrase</label>
                                                    </div>
                                                    <div
                                                        className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox style={{display: 'inline-block'}} type="checkbox"
                                                                  field="is_simulate_app"/>
                                                        <label style={{display: 'inline-block'}}>Simulate mobile
                                                            app</label>
                                                    </div>
                                                    <div
                                                        className="input-group-app align-middle display-block offset-bottom">
                                                        <Checkbox style={{display: 'inline-block'}} type="checkbox"
                                                                  field="is_testnet"/>
                                                        <label style={{display: 'inline-block'}}>Connect to
                                                            Testnet</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app offset-top display-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Remote node address</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="input-wrapper">
                                                    <Text field="remote_node_address" placeholder=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app offset-top display-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Remote node port</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="input-wrapper">
                                                    <Text field="remote_node_port" placeholder=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app offset-top display-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                            </div>
                                            <div className="col-md-9">
                                                <div className="input-wrapper">
                                                    <div className="input-group-app align-middle display-block">
                                                        <Checkbox style={{display: 'inline-block'}} type="checkbox"
                                                                  field="is_remote_node_ssl"/>
                                                        <label style={{display: 'inline-block'}}>Use https</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app offset-top display-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Number of data validators</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="input-wrapper">
                                                    <Text field="validators_count" placeholder=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group-app offset-top display-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Number of bootstrap nodes</label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="input-wrapper">
                                                    <Text field="bootstrap_nodes_count" placeholder=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn btn-right blue round round-bottom-right"
                                        >
                                            Send
                                        </button>
                                        <a onClick={() => this.props.closeModal()}
                                           className="btn btn-right round round-top-left">
                                            Cancel
                                        </a>
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
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    loadSavedSettings: () => dispatch(getSavedSettingsAction()),
    saveSettings: settings => dispatch(saveSettingsAction(settings))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSettings);
