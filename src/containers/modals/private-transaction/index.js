/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import converters from '../../../helpers/converters';
import {connect} from 'react-redux';
import {setModalData, setMopalType, setBodyModalParamsAction} from '../../../modules/modals';

import crypto from  '../../../helpers/crypto/crypto';


class PrivateTransactions extends React.Component {
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
        const isPassphrase = await this.validatePassphrase(params.passphrase);

        var data = {
            passphrase: params.passphrase
        };

        if (isPassphrase) {
            data.secretPhrase = params.passphrase;
        }

        this.props.setModalData(data);
        this.props.setBodyModalParamsAction(null, null);
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
                                <p>Show private transactions</p>
                            </div>
                            <div className="input-group-app">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label>Passphrase</label>
                                    </div>
                                    <div className="col-md-9">
                                        <Text field="passphrase" placeholder='Secret phrase' type={'password'}/>
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
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setMopalType: (passphrase) => dispatch(setMopalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase))
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateTransactions);
