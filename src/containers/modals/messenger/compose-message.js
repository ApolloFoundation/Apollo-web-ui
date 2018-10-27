/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import $ from 'jquery';

import InputForm from '../../components/input-form';
import AccountRS from '../../components/account-rs';
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import crypto from '../../../helpers/crypto/crypto';
import {issueAssetAction} from "../../../actions/assets";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import ModalFooter from '../../components/modal-footer'

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    issueAssetAction: (reqParams) => dispatch(issueAssetAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase))
});

class ComposeMessage extends React.Component {
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
        }
    }

    handleFormSubmit = async(values) => {
        if (values.messageToEncrypt) {
            values.messageToEncrypt = values.message;
            delete values.message;
        }

        this.setState({
            isPending: true
        });


        // Todo: finish form validating
        const res = await this.props.submitForm( values, 'sendMessage');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })

            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.issueAssetAction(values);
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Message has been submitted!', null, 5000);

            // this.props.setAlert('success', 'Transaction has been submitted!');
        }
    };

    handleAdvancedState = () => {
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
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue, setValue, getFormState }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Send message</p>
                                </div>
                                <div className="input-group-app form-group mb-15 display-block inline user">
                                    <div className="row form-group-white">
                                        <label htmlFor="recipient" className="col-sm-3 col-form-label">
                                            Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
                                        </label>
                                        <div className="col-sm-9">
                                            <div className="iconned-input-field">
                                                <AccountRS
                                                    field={'recipient'}
                                                    defaultValue={(this.props.modalData && this.props.modalData.recipient) ? this.props.modalData.recipient : ''}
                                                    setValue={setValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label align-self-start">
                                        Message
                                    </label>
                                    <div className="col-sm-9">
                                        <TextArea className="form-control" placeholder="Message" field="message" cols="30" rows="5" />
                                    </div>
                                </div>
                                <div className="mobile-class row mb-15 form-group-white">
                                    <div className="col-md-9 offset-md-3">
                                        <div className="form-check custom-checkbox mb-2">
                                            <Checkbox className="form-check-input custom-control-input"
                                                      type="checkbox"
                                                      defaultValue={true}
                                                      field="messageToEncrypt"/>
                                            <label className="form-check-label custom-control-label">
                                                Encrypt Message
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="input-group-app display-block offset-bottom">*/}
                                    {/*<div className="row">*/}
                                        {/*<div className="col-md-3">*/}
                                        {/*</div>*/}
                                        {/*<div className="col-md-9 offset-md-3">*/}
                                            {/*<div className="form-check custom-checkbox mb-2">*/}
                                                {/*<Checkbox className="form-check-input custom-control-input"*/}
                                                          {/*type="checkbox"*/}
                                                          {/*field="permanent_message"/>*/}
                                                {/*<label className="form-check-label custom-control-label">*/}
                                                    {/*Message is Never Deleted*/}
                                                {/*</label>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                {/*<div className="input-group-app display-block offset-bottom">*/}
                                    {/*<div className="row">*/}
                                        {/*<div className="col-md-3">*/}
                                            {/*<label>File</label>*/}
                                        {/*</div>*/}
                                        {/*<div className="col-md-9">*/}
                                            {/*<div className="iconned-input-field">*/}
                                                {/*<div className="input-group-app search">*/}
                                                    {/*<div className="iconned-input-field">*/}
                                                        {/*<div className="input-icon text"><i className="">Browse&hellip;</i></div>*/}
                                                        {/*<input*/}
                                                            {/*id="file"*/}
                                                            {/*type="file"*/}
                                                            {/*placeholder="Recipient"*/}

                                                        {/*/>*/}
                                                    {/*</div>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Fee
                                    </label>
                                    <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
                                        <InputForm
                                            field="feeATM"
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
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 95.39
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
                                                Send message
                                            </button>
                                    }
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>

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
                            </div>
                        </form>
                    )}
                />

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposeMessage);
