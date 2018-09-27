/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

import {Form, Text, Checkbox, TextArea} from 'react-form';
import InputForm from '../../../components/input-form';
import AccountRS from '../../../components/account-rs';
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import AdvancedSettings from '../../../components/advanced-transaction-settings'

class SellAlias extends React.Component {
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
            feeStatus: false,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAdvancedState = this.handleAdvancedState.bind(this);
    }

    componentDidMount = () => {
        this.getAlias();
    };

    async handleFormSubmit(values) {

        values = {
            ...values,
            aliasName: this.state.alias.aliasName,

        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'sellAlias');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Product has been listed!', null, 5000);
        }
    }

    getAlias = async () => {
        const alias = await this.props.getAliasAction({alias: this.props.modalData});

        if (alias) {
            this.setState({
                alias
            });
        }
    };

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
                <div className="modal-form">
                    {
                        this.state.alias &&
                        <div className="form-group-app">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title">
                                <p>Sell alias</p>
                            </div>
                            <div
                                // style={{margin: '55px -35px -35px -35px'}}
                                className="form-tabulator active"
                            >
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <p>Sell alias to Specific Account</p>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <p>Sell to Anyone</p>
                                    </a>
                                </div>
                                <Form
                                    onSubmit={(values) => this.handleFormSubmit(values)}
                                    render={({
                                                 submitForm, setValue, values, getFormState
                                             }) => (
                                        <form
                                            onSubmit={submitForm}
                                            className={classNames({
                                                "tab-body": true,
                                                "active": this.state.activeTab === 0
                                            })}>
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Alias
                                                </label>
                                                <div className="col-sm-9">
                                                    <span>{this.state.alias.aliasName}</span>
                                                </div>
                                            </div>
                                            <div className="input-group-app form-group mb-15 display-block inline user">
                                                <div className="row form-group-grey">
                                                    <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                        Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <div className="iconned-input-field">
                                                            <AccountRS
                                                                defaultValue={this.state.alias.accountRS}
                                                                field={'recipient'}
                                                                setValue={setValue}
                                                                placeholder={'Amount'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Price
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        type={'number'}
                                                        field="priceAPL"
                                                        placeholder="Price"
                                                        setValue={setValue}/>
                                                </div>
                                            </div>
                                            <div className="mobile-class form-group-grey row mb-15">
                                                <div className="col-sm-9 offset-sm-3">
                                                    <a className="no-margin btn static blue"
                                                       onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO_PRIVATE')}>
                                                        Private transaction
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="mobile-class row mb-15 form-group-grey">
                                                <div className="col-md-9 offset-md-3">
                                                    <div className="form-check custom-checkbox mb-2">
                                                        <Checkbox className="form-check-input custom-control-input"
                                                                  type="checkbox"
                                                                  field="add_message"/>
                                                        <label className="form-check-label custom-control-label">
                                                            Add a message?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                getFormState().values.add_message &&
                                                <div className="form-group row form-group-grey mb-15">
                                                    <label className="col-sm-3 col-form-label align-self-start">
                                                        Message
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <TextArea className="form-control" placeholder="Message" field="message" cols="30" rows="5" />
                                                    </div>
                                                </div>
                                            }
                                            {
                                                getFormState().values.add_message &&
                                                <div className="mobile-class row mb-15 form-group-grey">
                                                    <div className="col-md-9 offset-md-3">
                                                        <div className="form-check custom-checkbox mb-2">
                                                            <Checkbox className="form-check-input custom-control-input"
                                                                      type="checkbox"
                                                                      defaultValue={true}
                                                                      field="encrypt_message"/>
                                                            <label className="form-check-label custom-control-label">
                                                                Encrypt Message
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                getFormState().values.add_message &&
                                                <div className="mobile-class row mb-15 form-group-grey">
                                                    <div className="col-md-9 offset-md-3">
                                                        <div className="form-check custom-checkbox mb-2">
                                                            <Checkbox className="form-check-input custom-control-input"
                                                                      type="checkbox"
                                                                      defaultValue={false}
                                                                      field="permanent_message"/>
                                                            <label className="form-check-label custom-control-label">
                                                                Message is Never Deleted
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Fee
                                                    <span
                                                        onClick={async () => {
                                                            setValue("feeAPL", 1);
                                                        }}
                                                        style={{paddingRight: 0}}
                                                        className="calculate-fee"
                                                    >Calculate</span>
                                                </label>
                                                <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                                    <InputForm
                                                        field="feeAPL"
                                                        placeholder="Minimum fee"
                                                        type={"float"}
                                                        setValue={setValue}/>
                                                    <div className="input-group-append">
                                                        <span className="input-group-text">Apollo</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                                </label>
                                                <div className="col-sm-9">
                                                    <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                                </div>
                                            </div>
                                            <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                                <a
                                                    onClick={() => this.props.closeModal()}
                                                    className="btn round round-top-left"
                                                >
                                                    Cancel
                                                </a>
                                                <button
                                                    type="submit"
                                                    name={'closeModal'}
                                                    className="btn btn-right blue round round-bottom-right"
                                                >
                                                    Sell alias
                                                </button>
                                            </div>
                                            {/*<div className="btn-box align-buttons-inside absolute left-conner">
                                                <a
                                                    onClick={this.handleAdvancedState}
                                                    className="btn btn-right round round-bottom-left round-top-right absolute"
                                                    style={{left : 0, right: 'auto'}}
                                                >
                                                    {this.state.advancedState ? "Basic" : "Advanced"}
                                                </a>
                                            </div>
                                            <AdvancedSettings
                                                setValue={setValue}
                                                getFormState={getFormState}
                                                values={values}
                                                advancedState={this.state.advancedState}
                                            />*/}
                                        </form>
                                    )}
                                />
                                <Form
                                    onSubmit={(values) => this.handleFormSubmit(values)}
                                    render={({
                                                 submitForm, setValue, values, getFormState
                                             }) => (
                                        <form
                                            onSubmit={submitForm}
                                            className={classNames({
                                                "tab-body": true,
                                                "active": this.state.activeTab === 1
                                            })}>
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Alias
                                                </label>
                                                <div className="col-sm-9">
                                                    <span>{this.state.alias.aliasName}</span>
                                                </div>
                                            </div>
                                            <div className="input-group-app form-group mb-15 display-block inline user">
                                                <div className="row form-group-grey">
                                                    <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                        Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <div className="iconned-input-field">
                                                            <AccountRS
                                                                defaultValue={this.state.alias.accountRS}
                                                                field={'recipient'}
                                                                setValue={setValue}
                                                                placeholder={'Amount'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mobile-class form-group-grey row mb-15">
                                                <div className="col-sm-9 offset-sm-3">
                                                    <a className="no-margin btn static blue"
                                                       onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO_PRIVATE')}>
                                                        Private transaction
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Price
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        type={'number'}
                                                        field="priceAPL"
                                                        placeholder="Price"
                                                        setValue={setValue}/>
                                                </div>
                                            </div>
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Fee
                                                    <span
                                                        onClick={async () => {
                                                            setValue("feeAPL", 1);
                                                        }}
                                                        style={{paddingRight: 0}}
                                                        className="calculate-fee"
                                                    >Calculate</span>
                                                </label>
                                                <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                                    <InputForm
                                                        field="feeAPL"
                                                        placeholder="Minimum fee"
                                                        type={"float"}
                                                        setValue={setValue}/>
                                                    <div className="input-group-append">
                                                        <span className="input-group-text">Apollo</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row form-group-grey mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                                </label>
                                                <div className="col-sm-9">
                                                    <Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>
                                                </div>
                                            </div>
                                            <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                                <a
                                                    onClick={() => this.props.closeModal()}
                                                    className="btn round round-top-left"
                                                >
                                                    Cancel
                                                </a>

                                                {
                                                    !!this.state.isPending ?
                                                        <div
                                                            style={{
                                                                width: 100
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
                                                            style={{
                                                                width: 100
                                                            }}
                                                            type="submit"
                                                            name={'closeModal'}
                                                            className="btn btn-right blue round round-bottom-right"
                                                        >
                                                            Sell alias
                                                        </button>
                                                }
                                            </div>
                                            {/*<div className="btn-box align-buttononClick={this.handleAdvancedState}s-inside absolute left-conner">
                                                <a
                                                    onClick={this.handleAdvancedState}
                                                    className="btn btn-right round round-bottom-left round-top-right absolute"
                                                    style={{left : 0, right: 'auto'}}
                                                >
                                                    {this.state.advancedState ? "Basic" : "Advanced"}
                                                </a>
                                            </div>
                                            <AdvancedSettings
                                                setValue={setValue}
                                                getFormState={getFormState}
                                                values={values}
                                                advancedState={this.state.advancedState}
                                            />*/}
                                        </form>
                                    )}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellAlias);
