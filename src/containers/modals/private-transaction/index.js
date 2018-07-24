import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import converters from '../../../helpers/converters';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';

import curve25519 from '../../../helpers/crypto/curve25519'
import crypto from  '../../../helpers/crypto/crypto';

class PrivateTransactions extends React.Component {
    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount() {
        console.log(curve25519);
    }

    handleFormSubmit(params) {
        // validate passphrase

        let passphrase = params.passphrase;

        const privateKey = crypto.getPrivateKey(passphrase);
        const publicKey  = this.props.publicKey;

        var sharedKey;

        sharedKey = crypto.getSharedSecretJava(
            converters.hexStringToByteArray(crypto.getPrivateKey(passphrase)),
            converters.hexStringToByteArray(this.props.publicKey)
        );

        console.log(converters.hexStringToByteArray(crypto.getPrivateKey(passphrase)));
        console.log(converters.hexStringToByteArray(this.props.publicKey));

        sharedKey = new Uint8Array(sharedKey);
        console.log('sharedKey: ', converters.byteArrayToHexString(sharedKey));


        const data = {
            publicKey: publicKey,
            privateKey: privateKey
        };

        console.log(data);

        this.props.setModalData(data);
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
                        <div className="form-group">
                            <div className="form-title">
                                <p>Show private transactions</p>
                            </div>
                            <div className="input-group">
                                <div className="row">
                                    <div className="col-md-3">
                                        <label>Passphrase</label>
                                    </div>
                                    <div className="col-md-9">
                                        <Text field="passphrase" placeholder='Secret phrase' />
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
    setModalData: (data) => dispatch(setModalData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateTransactions);
