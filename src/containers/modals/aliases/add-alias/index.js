/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';

import { Form, Text } from 'react-form';
import {getAliasAction} from "../../../../actions/aliases";
import submitForm from "../../../../helpers/forms/forms";
import {NotificationManager} from "react-notifications";
import CustomSelect from '../../../components/select';
import AccountRS from '../../../components/account-rs';
import AdvancedSettings from '../../../components/advanced-transaction-settings';
import InputForm from '../../../components/input-form';
import {calculateFeeAction} from "../../../../actions/forms";
import ModalFooter from '../../../components/modal-footer'

import BackForm from '../../modal-form/modal-form-container';

const aliasTypeData = [
    { value: 'uri',     label: 'URI' },
    { value: 'account', label: 'Account' },
    { value: 'general', label: 'Other' },
];
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
                <BackForm
	                nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue, getFormState, values, getValue
                             }) => (
                        <form
                            className="modal-form add-alias"
                            onChange={() => this.props.saveSendModalState(values)}
                            onSubmit={submitForm}
                        >
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
	                                {this.props.modalsHistory.length > 1 &&
	                                <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                                }
                                    <p>Add Alias</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Type
                                    </label>
                                    <div className="col-sm-9">
                                        <CustomSelect
                                            field={'type'}
                                            setValue={setValue}
                                            getFormState={getFormState}
                                            onChange={this.handleChange}
                                            defaultValue={aliasTypeData[0]}
                                            options={aliasTypeData}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Alias
                                    </label>
                                    <div className="col-sm-9">
                                        <InputForm
                                            field="aliasName"
                                            placeholder="Alias name"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                {
                                    this.state.inputType === 'uri' &&
                                    <div className="form-group row form-group-white mb-15">
                                        <label className="col-sm-3 col-form-label">
                                            URI
                                        </label>
                                        <div className="col-sm-9">
                                            <InputForm
                                                type={"text"}
                                                field="aliasURI"
                                                placeholder="http://"
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
                                                        field={'aliasURI'}
                                                        setValue={setValue}
                                                        placeholder="Account ID"
                                                        value={getValue('recipient') || ''}
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
                                                field="aliasURI"
                                                placeholder="Data"
                                                setValue={setValue}/>
                                        </div>
                                    </div>
                                }
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
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm mb-0 no-left-padding">
                                        <InputForm
                                            field="feeAPL"
                                            placeholder="Amount"
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
                                                    width: 70.25
                                                }}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                <div className="ball-pulse-sync">
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
                                                Add alias
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
                        </form>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
	modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    getAliasAction: (requestParams) => dispatch(getAliasAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
	saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
	openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAlias);
