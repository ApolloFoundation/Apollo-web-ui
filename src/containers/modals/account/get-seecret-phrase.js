/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import {connect} from 'react-redux';
import {setModalData, setModalType, setBodyModalParamsAction} from '../../../modules/modals';
import {setAccountPassphrase} from '../../../modules/account';
import {getForging} from "../../../actions/login"
import crypto from  '../../../helpers/crypto/crypto';

import InfoBox from '../../components/info-box';


class PrivateTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async validatePassphrase(passphrase) {
        return await this.props.validatePassphrase(passphrase);
    }

    async handleFormSubmit(params) {
        let passphrase = params.passphrase;

        this.props.setAccountPassphrase(passphrase);
        this.props.getForging();
        // this.props.setBodyModalParamsAction(null, null);

        this.props.closeModal();
    }

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, getFormState, setValue, values
                             }) => (
                        <form className="modal-form"  onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Confirm getting forging status</p>
                                </div>
                                {/*<ModalFooter*/}
                                    {/*setValue={setValue}*/}
                                    {/*getFormState={getFormState}*/}
                                    {/*values={values}*/}
                                {/*/>*/}
                                <div className="input-group-app">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Secret phrase</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Text field="passphrase" placeholder='Secret phrase' type={'password'}/>
                                        </div>
                                    </div>
                                </div>

                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorect passphrase.
                                    </InfoBox>
                                }

                                <button type="submit" className="btn btn-right">Enter</button>
                            </div>
                        </form>
                    )} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateTransactions);
