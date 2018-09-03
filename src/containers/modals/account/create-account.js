import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';


import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import crypto from '../../../helpers/crypto/crypto';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import store from '../../../store'
import {getAccountDataAction} from "../../../actions/login";

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (modal, btn, data, requestType) => dispatch(submitForm.submitForm(modal, btn, data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    getAccountIdAsync: (passPhrase) => dispatch(crypto.getAccountIdAsync(passPhrase)),
    getAccountDataAction: (reqParams) => dispatch(getAccountDataAction(reqParams)),
});

class CreateUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            generatedPassphrase: null,
            generatedAccount: null,
            isValidating: false
        }
    }

    componentDidMount() {
        this.generatePassphrase();
    }

    handleFormSubmit = (values) => {
        // Todo: finish form validating
        if (values.secretPhrase === this.state.generatedPassphrase) {
            this.props.getAccountDataAction({
                account: this.state.generatedAccount
            })
        } else {
            NotificationManager.error('Incorrect secret phrase!', 'Error', 5000);
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

    generatePassphrase = async () => {
        const generatedPassphrase = crypto.generatePassPhrase();
        const generatedAccount = store.dispatch(await this.props.getAccountIdAsync(generatedPassphrase));

        this.setState({
            ...this.state,
            generatedPassphrase : generatedPassphrase.join(' '),
            generatedAccount : generatedAccount
        })
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({ submitForm, values, addValue, removeValue }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            {
                                !this.state.isValidating &&
                                <div className="form-group">
                                    <div className="form-title">
                                        <p>Create Your Wallet</p>
                                    </div>
                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label>Your randomly generated passphrase is:</label>
                                            </div>
                                            <div className="col-md-12">
                                                <div>
                                                    <InfoBox info>
                                                        {this.state.generatedPassphrase}
                                                    </InfoBox>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label>Write down this passphrase and store securely (order and capitalization matter). This passphrase will be needed to use your wallet.</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label>Your public wallet address is:</label>
                                            </div>
                                            <div className="col-md-12">
                                                <div
                                                    style={{
                                                        width: "100%"
                                                    }}
                                                >
                                                    <InfoBox info>
                                                        {this.state.generatedAccount}
                                                    </InfoBox>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label>Attention:</label>
                                            </div>
                                            <div className="col-md-12">
                                                <div
                                                    style={{
                                                        width: "100%"
                                                    }}
                                                >
                                                    <InfoBox danger>
                                                        <strong>
                                                            Remember:
                                                        </strong>
                                                        Anyone with this passphrase will have total control of your wallet.
                                                    </InfoBox>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group display-block offset-bottom">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Checkbox /> <label>I will not lose my passphrase</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <a
                                            onClick={() => {this.setState({...this.state, isValidating: true})}}
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                        >
                                            Next
                                        </a>

                                    </div>
                                </div>
                            }
                            {
                                this.state.isValidating &&
                                <div className="form-group">
                                    <div className="form-title">
                                        <p>Create Your Wallet</p>
                                    </div>
                                    <div className="input-group block offset-bottom offset-top">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Secret Phrase</label>
                                            </div>
                                            <div className="col-md-9">
                                                <TextArea rows={5} type="text" field={'secretPhrase'} placeholder="Secret Phrase"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="btn-box align-buttons-inside absolute right-conner">
                                        <button
                                            type="submit"
                                            name={'closeModal'}
                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                        >
                                            Create new Account
                                        </button>

                                    </div>
                                </div>
                            }
                        </form>
                    )}
                />

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
