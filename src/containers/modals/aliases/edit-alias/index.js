/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../../modules/modals';
import classNames from 'classnames';

import { Form, Text } from 'react-form';
import InputForm from '../../../components/input-form';
import CustomSelect from '../../../components/select';
import {getAliasAction} from '../../../../actions/aliases/';
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import AdvancedSettings from '../../../components/advanced-transaction-settings'
import AccountRS from '../../../components/account-rs';
import ModalFooter from '../../../components/modal-footer'


const typeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];

class EditAlias extends React.Component {
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
            feeStatus: false
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
            aliasURI: values[this.state.inputType]
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( values, 'setAlias');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Product has been listed!', null, 5000);
        }

        // this.props.sendTransaction(values);
        // this.props.setBodyModalParamsAction(null, {});
        // this.props.setAlert('success', 'Transaction has been submitted!');
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
                                 submitForm, setValue, values, getFormState
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            {
                                this.state.alias &&
                                <div className="form-group-app">
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Edit Alias</p>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Type
                                        </label>
                                        <div className="col-sm-9">
                                                <CustomSelect
                                                    field={'type'}
                                                    setValue={setValue}
                                                    onChange={this.handleChange}
                                                    defaultValue={typeData[1]}
                                                    options={typeData}
                                                />
                                        </div>
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Alias
                                        </label>
                                        <div className="col-sm-9">
                                            <span>{this.state.alias.aliasName}</span>
                                        </div>
                                    </div>
                                    <div className="input-group-app mb-15 display-block">
                                        {
                                            this.state.inputType === 'uri' &&
                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    URI
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        field="uri"
                                                        placeholder="http://"
                                                        defaultValue={this.state.alias.aliasURI}
                                                        setValue={setValue}/>
                                                </div>
                                            </div>

                                        }
                                        {
                                            this.state.inputType === 'account' &&
                                            <div className="input-group-app form-group mb-15 display-block inline user">
                                                <div className="row form-group-white">
                                                    <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                                        Account
                                                    </label>
                                                    <div className="col-sm-9">
                                                        <div className="iconned-input-field">
                                                            <AccountRS
                                                                field={'account'}
                                                                placeholder={'Account ID'}
                                                                setValue={setValue}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {
                                            this.state.inputType === 'general' &&
                                            <div className="form-group row form-group-white mb-15">
                                                <label className="col-sm-3 col-form-label">
                                                    Data
                                                </label>
                                                <div className="col-sm-9">
                                                    <InputForm
                                                        field="general"
                                                        defaultValue={this.state.alias.aliasURI}
                                                        placeholder="Data"
                                                        setValue={setValue}/>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            Fee
                                            <span
                                                onClick={async () => {
                                                    setValue("feeAPL", 1);
                                                }}
                                                style={{paddingRight: 0}}
                                                className="calculate-fee"
                                            >
                                            Calculate
                                        </span>
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
                                    <ModalFooter
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                    />
                                    {/*<div className="form-group row form-group-white mb-15">*/}
                                        {/*<label className="col-sm-3 col-form-label">*/}
                                            {/*Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>*/}
                                        {/*</label>*/}
                                        {/*<div className="col-sm-9">*/}
                                            {/*<Text className="form-control" field="secretPhrase" placeholder="Secret Phrase" type={'password'}/>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}

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
                                                    Edit alias
                                                </button>
                                        }
                                    </div>
                                    {/*<div className="btn-box align-buttons-inside absolute left-conner">*/}
                                        {/*<a*/}
                                            {/*onClick={this.handleAdvancedState}*/}
                                            {/*className="btn btn-right round round-bottom-left round-top-right absolute"*/}
                                            {/*style={{left : 0, right: 'auto'}}*/}
                                        {/*>*/}
                                            {/*{this.state.advancedState ? "Basic" : "Advanced"}*/}
                                        {/*</a>*/}
                                    {/*</div>*/}
                                    <AdvancedSettings
                                        setValue={setValue}
                                        getFormState={getFormState}
                                        values={values}
                                        advancedState={this.state.advancedState}
                                    />
                                </div>
                            }
                        </form>
                    )}
                >

                </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAlias);
