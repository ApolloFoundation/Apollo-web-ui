/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import converters from '../../../helpers/converters';
import {connect} from 'react-redux';
import submitForm from '../../../helpers/forms/forms'
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../modules/modals';
import store from '../../../store'
import crypto from  '../../../helpers/crypto/crypto';
import {NotificationManager} from "react-notifications";
import {getForging} from "../../../actions/login";
// import {processForm} from '../../../../actions/forms'



class Confirm2FAforging extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async validatePassphrase(passphrase) {
        return await this.props.validatePassphrase(passphrase);
    }

    async handleFormSubmit(params) {
        const {account, passphrase}  = this.props
        const action = this.props.action.getStatus;

        const requestParams = {
            requestType: action,
            passphrase: passphrase,
            account: account,
            ...params
        };
        const forging = await store.dispatch(await submitForm.submitForm(requestParams, action));

        if (forging) {
            if (!forging.errorCode) {
                const forgingStatus = await this.props.getForging();

                if (action === 'startForging') {

                    NotificationManager.success('Forging has been started.', null, 5000);
                } else {
                    NotificationManager.success('Forging has been stopped.', null, 5000);
                }

                this.props.action.confirmStatus(forgingStatus);
                this.props.closeModal();
            } else {
                NotificationManager.error(forging.errorDescription, 'Error', 5000);
            }
        }
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                 submitForm
                             }) => (
                        <form className="modal-form"  onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    {
                                        this.props.action &&
                                        this.props.action.getStatus === 'startForging' ?
                                            <p>Confirm start forging</p>
                                            :
                                            <p>Confirm stop forging</p>

                                    }

                                </div>
                                <div className="input-group-app">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>2FA code</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="code2FA" placeholder='2FA Code' type={'password'}/>
                                        </div>
                                    </div>
                                </div>


                                <button type="submit" className="btn btn-right">Enter</button>
                            </div>
                        </form>
                    )} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    action: state.modals.modalData,
    passphrase: state.account.passPhrase,
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
    // processForm :(values, requestType, successMesage, successCallback) => dispatch(processForm(values, requestType, successMesage, successCallback)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase))
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm2FAforging);
