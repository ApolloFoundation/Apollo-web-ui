import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

import { Form, Text } from 'react-form';
import InfoBox from '../../../components/info-box';
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import CustomSelect from '../../../components/select';
import AccountRS from '../../../components/account-rs';
import AdvancedSettings from '../../../components/advanced-transaction-settings'

class AddAlias extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            activeTab: 0,
            advancedState: false,
            inputType: 'uri',

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }


    async handleFormSubmit(values) {

        this.props.submitForm(null, null, values, 'setAlias')
            .done((res) => {
                if (res.errorCode) {
                    NotificationManager.error(res.errorDescription, 'Error', 5000)
                } else {
                    this.props.setBodyModalParamsAction(null, {});

                    NotificationManager.success('Product has been listed!', null, 5000);
                }
            })

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

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    };

    handleChange = (value) => {
        this.setState({
            inputType: value
        })
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue, getFormState
                             }) => (
                        <form
                            className="modal-form"
                            onSubmit={submitForm}
                            onChange={() => this.handleChange(getFormState)}
                        >
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Add Alias</p>
                                </div>
                                <div className="input-group-app offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Type</label>
                                        </div>
                                        <div className="col-md-9">
                                            <CustomSelect
                                                field={'type'}
                                                setValue={setValue}
                                                getFormState={getFormState}
                                                onChange={this.handleChange}
                                                options={[
                                                    { value: 'uri',     label: 'URI' },
                                                    { value: 'account', label: 'Account' },
                                                    { value: 'general', label: 'Other' },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Alias</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="aliasName" placeholder="Alias name" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block">
                                    {
                                        this.state.inputType == 'uri' &&
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>URI</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text field="aliasURI" placeholder="http://"/>
                                            </div>
                                        </div>
                                    }
                                    {
                                        this.state.inputType == 'account' &&
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Account</label>
                                            </div>
                                            <div className="col-md-9">
                                                <AccountRS
                                                    field="aliasURI"
                                                    setValue={setValue}
                                                    placeholder="Account RS"
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        this.state.inputType == 'general' &&
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Data</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Text field="aliasURI" placeholder="http://"/>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="input-group-app offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Fee</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="feeATM" placeholder="Amount" type={'number'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group-app offset-top display-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Passphrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="secretPhrase" placeholder="secretPhrase" />
                                        </div>
                                    </div>
                                </div>

                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className="btn btn-right blue round round-bottom-right round-top-left"
                                    >
                                        Add alias
                                    </button>

                                </div>
                                <div className="btn-box align-buttons-inside absolute left-conner">
                                    <a
                                        onClick={this.handleAdvancedState}
                                        className="btn btn-right round round-bottom-left round-top-right absolute"
                                        style={{left : 0, right: 'auto'}}
                                    >
                                        Advanced
                                    </a>
                                </div>
                                <AdvancedSettings
                                    setValue={setValue}
                                    advancedState={this.state.advancedState}
                                />
                            </div>
                        </form>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAlias);
