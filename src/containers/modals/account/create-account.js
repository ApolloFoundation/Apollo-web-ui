/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {generateAccountAction} from '../../../actions/account'

import AdvancedSettings from '../../components/advanced-transaction-settings'
import InfoBox from '../../components/info-box'
import {Form, Text, TextArea, Number, Checkbox} from 'react-form';
import crypto from '../../../helpers/crypto/crypto';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {setAlert} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import store from '../../../store'
import {getAccountDataAction} from "../../../actions/login";
import ContentLoader from '../../components/content-loader'
import ModalFooter from '../../components/modal-footer'
import classNames from 'classnames';

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setAlert: (type, message) => dispatch(setAlert(type, message)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getAccountDataAction: (reqParams) => dispatch(getAccountDataAction(reqParams)),
});

class CreateUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            generatedPassphrase: null,
            generatedAccount: null,
            isValidating: false,
            isAccountLoaded: false
        }
    };

    componentDidMount() {
        this.generateAccount();
        this.generatePassphrase();
    };

    generateAccount = async () => {
        const geneatedAccount = await generateAccountAction();

        if (geneatedAccount) {
            this.setState({
                isAccountLoaded: true,
                accountData: geneatedAccount
            })
        }
    };

    handleFormSubmit = (values) => {
        if (values.secretPhrase === this.state.accountData.passphrase) {
            this.setState({
                isPending: true
            });
            this.props.getAccountDataAction({
                account: this.state.accountData.accountRS
            });
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
        const generatedPassphrase = crypto.generatePassPhraseAPL();
        const generatedAccount = store.dispatch(await this.props.getAccountIdAsyncApl(generatedPassphrase.join(' ')));

        this.setState({
            ...this.state,
            generatedPassphrase: generatedPassphrase.join(' '),
            generatedAccount: generatedAccount
        })
    };

    render() {
        return (
            <React.Fragment>
                <div
                    className={'area-hider'}
                    style={{
                        'position': 'fixed',
                        'top': '0',
                        'bottom': '0',
                        'left': '0',
                        'right': '0',
                    }}
                />
                <div className="modal-box">
                    <Form
                        onSubmit={(values) => this.handleFormSubmit(values)}
                        render={({submitForm, values, addValue, removeValue, getFormState, setValue}) => (
                            <form className="modal-form" onSubmit={submitForm}>
                                {
                                    !this.state.isValidating &&
                                    <div className="form-group-app">
                                        <a onClick={() => this.props.closeModal()} className="exit"><i
                                            className="zmdi zmdi-close"/></a>

                                        <div className="form-title">
                                            <p>Create Your Wallet</p>
                                        </div>

                                        {
                                            this.state.isAccountLoaded &&
                                            <React.Fragment>

                                                <div className="input-group-app display-block offset-bottom">
                                                    <div className="row">
                                                        <div className="col-md-12 mb-15">
                                                            <label>Your randomly generated passphrase is:</label>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div>
                                                                <InfoBox info>
                                                                    {this.state.accountData.passphrase}
                                                                </InfoBox>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-group-app display-block offset-bottom">
                                                    <div className="row">
                                                        <div className="col-md-12 mb-15">
                                                            <label>Write down this passphrase and store securely (order and
                                                                capitalization matter). This passphrase will be needed to use your
                                                                wallet.</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="input-group-app display-block offset-bottom">
                                                    <div className="row">
                                                        <div className="col-md-12 mb-15">
                                                            <label>Your public wallet address is:</label>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div
                                                                style={{
                                                                    width: "100%"
                                                                }}
                                                            >
                                                                <InfoBox info>
                                                                    {this.state.accountData.accountRS}
                                                                </InfoBox>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="input-group-app display-block offset-bottom">
                                                    <div className="row">
                                                        <div className="col-md-12 mb-15">
                                                            <label>Your wallet`s public key is:</label>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div
                                                                style={{
                                                                    width: "100%"
                                                                }}
                                                            >
                                                                <InfoBox info>
                                                                    {this.state.accountData.publicKey}
                                                                </InfoBox>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="input-group-app display-block offset-bottom">
                                                    <div className="row">
                                                        <div className="col-md-12 mb-15">
                                                            <label>Attention:</label>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div
                                                                style={{
                                                                    width: "100%"
                                                                }}
                                                            >
                                                                <InfoBox danger>
                                                                    <strong>Remember</strong> your generated passphrase and your public wallet address!
                                                                </InfoBox>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="input-group-app display-block offset-bottom">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <Checkbox defaultValue={false} field="losePhrase"/> <label>I will not lose my
                                                            passphrase</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="btn-box align-buttons-inside absolute right-conner">
                                                    <a
                                                        onClick={() => {
                                                            if (!getFormState().values.losePhrase) {
                                                                NotificationManager.error('You have to verify that you will not lose your passphrase', 'Error', 7000);
                                                                return;
                                                            }
                                                            this.setState({...this.state, isValidating: true})
                                                        }}
                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                    >
                                                        Next
                                                    </a>

                                                </div>
                                            </React.Fragment>
                                            ||
                                            <ContentLoader />
                                        }

                                    </div>
                                }
                                {
                                    this.state.isValidating &&
                                    <div className="form-group-app">
                                        <div className="form-title">
                                            <p>Create Your Wallet</p>
                                        </div>
                                        <ModalFooter
                                            setValue={setValue}
                                            getFormState={getFormState}
                                            values={values}
                                        />


                                        <div className="btn-box align-buttons-inside absolute right-conner">
                                            <button
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                            >
                                                Create new Account
                                            </button>

                                            {
                                                !!this.state.isPending ?
                                                    <div
                                                        style={{
                                                            width: 121.5
                                                        }}
                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
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
                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                    >
                                                        Create new Account
                                                    </button>
                                            }

                                        </div>
                                    </div>
                                }
                            </form>
                        )}
                    />

                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
