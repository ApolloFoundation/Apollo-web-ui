/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {CopyToClipboard} from "react-copy-to-clipboard";
import {NotificationManager} from 'react-notifications';
import {Checkbox, Form, Text, TextArea} from 'react-form';
import InputForm from '../../components/input-form';
import InfoBox from '../../components/info-box';
import ContentLoader from '../../components/content-loader'
import {setAlert, setBodyModalParamsAction, setModalData} from "../../../modules/modals";
import submitForm from "../../../helpers/forms/forms";
import crypto from '../../../helpers/crypto/crypto';
import {getAccountDataAction} from "../../../actions/login";
import {createAccountAction, generateAccountAction, generatePDF} from '../../../actions/account';

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    account: state.account.account
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
            activeTab: 0,
            generatedPassphrase: null,
            generatedAccount: null,
            isValidating: false,
            isCustomPassphrase: true,
            isAccountLoaded: false,
            isCustomPassphraseForStandardWallet: false,
            tinggi: 11.69,
            lebar: '08.27',
        }
    };

    componentDidUpdate() {
        if (this.state.account) {
            this.props.closeModal();
        }
    }

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    };

    generateAccount = async (requestParams) => {
        const geneatedAccount = await generateAccountAction(requestParams);

        if (geneatedAccount) {
            const keySeed = await createAccountAction({
                account: geneatedAccount.accountRS,
                passphrase: geneatedAccount.passphrase
            });

            this.setState({
                isAccountLoaded: true,
                accountData: geneatedAccount,
                keySeed: keySeed,
                isCustomPassphrase: false,

            })
        }
    };

    handleFormSubmit = async (values) => {
        if (this.state.selectedOption === 0) {
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
        }
        if (this.state.selectedOption === 1) {
            if (values.secretPhrase === this.state.generatedPassphrase) {
                this.setState({
                    isPending: true
                });
                this.props.getAccountDataAction({
                    account: this.state.generatedAccount
                });
            } else {
                NotificationManager.error('Incorrect secret phrase!', 'Error', 5000);
            }
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

    generatePassphrase = async (passphrase) => {
        const generatedPassphrase = passphrase ? passphrase : crypto.generatePassPhraseAPL();
        const generatedAccount = await this.props.getAccountIdAsyncApl(passphrase ? passphrase : generatedPassphrase.join(' '));

        this.setState({
            ...this.state,
            generatedPassphrase: passphrase ? passphrase : generatedPassphrase.join(' '),
            generatedAccount: generatedAccount,
            isRSAccountLoaded: true,
            isCustomPassphraseForStandardWallet: true,
        })
    };

    handleGoBack = () =>
        this.setState({isValidating: false}, () => {
            setTimeout(() => {
                const element = document.querySelector('#modal-window-container .modal-box');
                element.classList.add('active')
            }, 300)
        });


    render() {
        return (
            <React.Fragment>
                {
                    !this.state.isValidating &&
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
                            <div className="modal-form">
                                <div className="form-group-app">
                                    <button type="button" onClick={() => this.props.closeModal()} className="exit"><i
                                        className="zmdi zmdi-close"/></button>

                                    <div className="form-title">
                                        <p>Create New Wallet</p>
                                    </div>

                                    <div className="form-tabulator active no-padding">
                                        <div className="form-tab-nav-box justify-left">
                                            <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                                "form-tab": true,
                                                "active": this.state.activeTab === 0
                                            })}>
                                                <p>Standard wallet</p>
                                            </a>
                                            <a
                                                onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                                "form-tab": true,
                                                "active": this.state.activeTab === 1
                                            })}
                                            >
                                                <p>Vault Wallet</p>
                                            </a>
                                        </div>

                                        <Form
                                            onSubmit={(values) => this.handleFormSubmit(values)}
                                            render={({
                                                         submitForm, setValue, values, getFormState
                                                     }) => (
                                                <form
                                                    className={classNames({
                                                        "tab-body": true,
                                                        "active": this.state.activeTab === 1
                                                    })}
                                                    onSubmit={submitForm}
                                                >
                                                    {
                                                        this.state.isCustomPassphrase &&
                                                        <React.Fragment>
                                                            <div className="form-group-app transparent">
                                                                <div className="form-title">
                                                                    <p>Create your Vault</p>
                                                                </div>
                                                                <div
                                                                    className="input-group-app display-block offset-bottom">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div>
                                                                                <InfoBox info>
                                                                                    <ul className={'marked-list'}>
                                                                                        <li>The most secure Apollo
                                                                                            Wallet.
                                                                                        </li>
                                                                                        <li>You can log in using your Account
                                                                                            ID.
                                                                                        </li>
                                                                                        <li>The wallet is encrypted (via
                                                                                            Secret Key) on one device.
                                                                                        </li>
                                                                                        <li>You can export/import your
                                                                                            Secret Key to use on other
                                                                                            devices.
                                                                                        </li>
                                                                                        <li>2FA works from any device
                                                                                            when you use your Vault.
                                                                                        </li>
                                                                                        <li>If you lose your device or uninstall the wallet before exporting your secret file, you will lose access to your account.
                                                                                        </li>
                                                                                    </ul>
                                                                                </InfoBox>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="input-group-app display-block offset-bottom">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <InfoBox info>
                                                                                You can create your own custom secret
                                                                                phrase or create an account with a
                                                                                randomly generated secret phrase.
                                                                                <br/>
                                                                                <div
                                                                                    className="input-group-app display-block offset-bottom"
                                                                                    style={{marginTop: 18}}
                                                                                >
                                                                                    <div className="row">
                                                                                        <div className="col-md-12">
                                                                                            <Checkbox
                                                                                                className={'lighten'}
                                                                                                field="isCustomPassphrase"
                                                                                                onChange={(e) => {

                                                                                                    if (e) {
                                                                                                        this.setState({
                                                                                                            isCustomPassphraseTextarea: true
                                                                                                        });
                                                                                                    } else {
                                                                                                        this.setState({
                                                                                                            isCustomPassphraseTextarea: false
                                                                                                        });
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                            <label
                                                                                                style={{color: '#ecf0f1'}}
                                                                                            >
                                                                                                Use custom secret
                                                                                                phrase.
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/*<a*/}
                                                                                {/*style={{marginTop: 18}}*/}
                                                                                {/*className={'btn lighten static'}*/}
                                                                                {/*onClick={() => this.generateAccount({})}*/}
                                                                                {/*>*/}
                                                                                {/*Generate account*/}
                                                                                {/*</a>*/}
                                                                            </InfoBox>
                                                                        </div>
                                                                    </div>

                                                                    {
                                                                        this.state.isCustomPassphraseTextarea &&
                                                                        <div className="row">
                                                                            <div className="col-md-3">
                                                                                <label style={{padding: 0}}>Your account
                                                                                    secret phrase</label>
                                                                            </div>
                                                                            <div className="col-md-9">
                                                                                <TextArea
                                                                                    field={'newAccountpassphrse'}
                                                                                    placeholder={'Secret Phrase'}
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                                                                Alphanumeric Characters Only
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="btn-box align-buttons-inside absolute right-conner">

                                                                {
                                                                    this.state.isCustomPassphraseTextarea &&
                                                                    <button
                                                                        type={'button'}
                                                                        onClick={() => {
                                                                            const {values} = getFormState();

                                                                            if (!values.newAccountpassphrse) {
                                                                                NotificationManager.error('Secret Phrase not specified.');
                                                                                return;
                                                                            }
                                                                            this.generateAccount({
                                                                                passphrase: values.newAccountpassphrse
                                                                            })
                                                                        }}
                                                                        name={'closeModal'}
                                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                                    >
                                                                        Create account
                                                                    </button>
                                                                }
                                                                {
                                                                    !this.state.isCustomPassphraseTextarea &&
                                                                    <button
                                                                        type={'button'}
                                                                        onClick={() => {

                                                                            this.generateAccount({})
                                                                        }}
                                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                                    >
                                                                        Create account
                                                                    </button>
                                                                }
                                                            </div>
                                                        </React.Fragment>

                                                    }
                                                    {
                                                        !this.state.isCustomPassphrase &&
                                                        <div className="form-group-app transparent">
                                                            <div className="form-title">
                                                                <p>Create your Vault</p>
                                                            </div>
                                                            {
                                                                this.state.isAccountLoaded &&
                                                                <React.Fragment>

                                                                    <Text field={'option'} type={'hidden'}
                                                                          defaultValue={0}/>

                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div>
                                                                                    <InfoBox info>
                                                                                        <ul className={'marked-list'}>
                                                                                            <li>The most secure Apollo
                                                                                                Wallet.
                                                                                            </li>
                                                                                            <li>You can log in using your
                                                                                                Account ID.
                                                                                            </li>
                                                                                            <li>The wallet is encrypted
                                                                                                (via Secret Key) on one
                                                                                                device.
                                                                                            </li>
                                                                                            <li>You can export/import
                                                                                                your Secret Key to use
                                                                                                on other devices.
                                                                                            </li>
                                                                                            <li>2FA works from any
                                                                                                device when you use your
                                                                                                Vault.
                                                                                            </li>
                                                                                            <li>If you lose your device or uninstall the wallet before exporting your secret file, you will lose access to your account.
                                                                                            </li>
                                                                                        </ul>
                                                                                    </InfoBox>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
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
                                                                                        <strong>Remember</strong> to
                                                                                        store your Account ID and secret
                                                                                        phrase in a secured place.
                                                                                        Make sure to write down this
                                                                                        secret phrase and store it
                                                                                        securely (the secret phrase is
                                                                                        order and case sensitive). This
                                                                                        secret phrase is needed to use
                                                                                        your wallet.
                                                                                    </InfoBox>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12 mb-15">
                                                                                <label>Your randomly generated secret
                                                                                    phrase is:</label>
                                                                            </div>
                                                                            <div className="col-md-12">
                                                                                <div>
                                                                                    {
                                                                                        this.state &&
                                                                                        this.state.keySeed &&
                                                                                        this.state.accountData &&
                                                                                        this.state.keySeed.secretBytes &&
                                                                                        <InfoBox attentionLeft>
                                                                                            Secret Phrase: <span
                                                                                            className={'itatic'}>{this.state.accountData.passphrase}</span>
                                                                                            <br/>
                                                                                            <br/>
                                                                                            Account ID: <span
                                                                                            className={'itatic'}>{this.state.accountData.accountRS}</span>
                                                                                            <br/>
                                                                                            <br/>
                                                                                            Public Key: <span
                                                                                            className={'itatic word-brake-for-info'}>{this.state.accountData.publicKey}</span>
                                                                                            <br/>
                                                                                            <br/>
                                                                                            <CopyToClipboard
                                                                                                text={
                                                                                                    `Secret Phrase: ${this.state.accountData.passphrase}\n` +
                                                                                                    `Account ID: ${this.state.accountData.accountRS}\n` +
                                                                                                    `Public Key: ${this.state.accountData.publicKey}\n`
                                                                                                }
                                                                                                onCopy={() => {
                                                                                                    NotificationManager.success('The account data has been copied to clipboard.')
                                                                                                }}
                                                                                            >
                                                                                                <button
                                                                                                    type={'button'}
                                                                                                    className="btn blue static"
                                                                                                >
                                                                                                    Copy account data to
                                                                                                    clipboard.
                                                                                                </button>

                                                                                            </CopyToClipboard>
                                                                                            <br/>
                                                                                            <br/>
                                                                                            <button
                                                                                                type={'button'}
                                                                                                className="btn blue static hide-media"
                                                                                                onClick={() => generatePDF([
                                                                                                    {
                                                                                                        name: 'Account ID',
                                                                                                        value: this.state.accountData.accountRS
                                                                                                    },
                                                                                                    {
                                                                                                        name: 'Secret Phrase',
                                                                                                        value: this.state.accountData.passphrase
                                                                                                    },
                                                                                                    {
                                                                                                        name: 'Public Key',
                                                                                                        value: this.state.accountData.publicKey
                                                                                                    },
                                                                                                ])}
                                                                                            >
                                                                                                Print Wallet
                                                                                            </button>
                                                                                        </InfoBox>
                                                                                    }

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <Checkbox defaultValue={false}
                                                                                          field="losePhrase"/>
                                                                                <label>I wrote down my Account ID,
                                                                                    Secret phrase. It is now stored in a
                                                                                    secured place</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="btn-box align-buttons-inside absolute right-conner">
                                                                        <button
                                                                            onClick={() => {
                                                                                if (!getFormState().values.losePhrase) {
                                                                                    NotificationManager.error('You have to verify that you stored your private data', 'Error', 7000);
                                                                                    return;
                                                                                }
                                                                                this.setState({
                                                                                    ...this.state,
                                                                                    isValidating: true,
                                                                                    selectedOption: 0
                                                                                })
                                                                            }}
                                                                            type="submit"
                                                                            name={'closeModal'}
                                                                            className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                                        >
                                                                            Next
                                                                        </button>

                                                                    </div>
                                                                </React.Fragment>
                                                                ||
                                                                <ContentLoader/>
                                                            }

                                                        </div>
                                                    }
                                                    {
                                                        this.state.isValidating &&
                                                        <div className="form-group-app">
                                                            <div className="form-title">
                                                                <p>Create Your Wallet</p>
                                                            </div>

                                                            <div
                                                                className="form-group row form-group-white mb-15"
                                                                style={{marginBottom: 15}}
                                                            >
                                                                <label className="col-sm-3 col-form-label">
                                                                    Secret phrase&nbsp;<i
                                                                    className="zmdi zmdi-portable-wifi-changes"/>
                                                                </label>
                                                                <div className="col-sm-9">
                                                                    <InputForm
                                                                        isPlain
                                                                        className={'form-control'}
                                                                        type="password"
                                                                        field="secretPhrase"
                                                                        placeholder="Secret Phrase"
                                                                        setValue={setValue}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="btn-box align-buttons-inside absolute right-conner">
                                                                {
                                                                    !!this.state.isPending ?
                                                                        <div
                                                                            style={{
                                                                                width: 121.5
                                                                            }}
                                                                            className="btn btn-right blue round round-top-left round-bottom-right"
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
                                                                            className="btn btn-right blue round round-top-left round-bottom-right"
                                                                        >
                                                                            Create New Account
                                                                        </button>
                                                                }
                                                                <button
                                                                    type="button"
                                                                    name={'closeModal'}
                                                                    className="btn btn-right round round-top-left"
                                                                    onClick={this.handleGoBack}
                                                                >
                                                                    Back
                                                                </button>
                                                            </div>
                                                        </div>
                                                    }
                                                </form>
                                            )}
                                        >
                                        </Form>
                                        <Form
                                            onSubmit={(values) => this.handleValidateToken(values)}
                                            render={({
                                                         submitForm, setValue, values, getFormState
                                                     }) => (
                                                <form
                                                    className={classNames({
                                                        "tab-body": true,
                                                        "active": this.state.activeTab === 0
                                                    })}
                                                    onSubmit={submitForm}
                                                >
                                                    {
                                                        !this.state.isCustomPassphraseForStandardWallet &&
                                                        <React.Fragment>
                                                            <div className="form-group-app transparent">
                                                                <div className="form-title">
                                                                    <p>Create Your Standard Wallet</p>
                                                                </div>
                                                                <div
                                                                    className="input-group-app display-block offset-bottom">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div>
                                                                                <InfoBox info>
                                                                                    <ul>
                                                                                        <li>You can log in to this
                                                                                            wallet using only your
                                                                                            secret phrase
                                                                                        </li>
                                                                                        <li>Available to use from any
                                                                                            device
                                                                                        </li>
                                                                                        <li>2FA is available only on the
                                                                                            device where it was enabled
                                                                                        </li>
                                                                                    </ul>
                                                                                </InfoBox>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="input-group-app display-block offset-bottom">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <InfoBox info>
                                                                                You can create your own custom secret
                                                                                phrase or create an account with a
                                                                                randomly generated secret phrase.
                                                                                <br/>
                                                                                <div
                                                                                    className="input-group-app display-block offset-bottom"
                                                                                    style={{marginTop: 18}}
                                                                                >
                                                                                    <div className="row">
                                                                                        <div className="col-md-12">
                                                                                            <Checkbox
                                                                                                className={'lighten'}
                                                                                                field="isCustomPassphrase"
                                                                                                onChange={(e) => {

                                                                                                    if (e) {
                                                                                                        this.setState({
                                                                                                            isCustomPassphraseTextarea: true
                                                                                                        });
                                                                                                    } else {
                                                                                                        this.setState({
                                                                                                            isCustomPassphraseTextarea: false
                                                                                                        });
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                            <label
                                                                                                style={{color: '#ecf0f1'}}
                                                                                            >
                                                                                                Use custom secret
                                                                                                phrase.
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/*<a*/}
                                                                                {/*style={{marginTop: 18}}*/}
                                                                                {/*className={'btn lighten static'}*/}
                                                                                {/*onClick={() => this.generateAccount({})}*/}
                                                                                {/*>*/}
                                                                                {/*Generate account*/}
                                                                                {/*</a>*/}
                                                                            </InfoBox>
                                                                        </div>
                                                                    </div>

                                                                    {
                                                                        this.state.isCustomPassphraseTextarea &&
                                                                        <div className="row">
                                                                            <div className="col-md-3">
                                                                                <label style={{padding: 0}}>Your account
                                                                                    secret phrase</label>
                                                                            </div>
                                                                            <div className="col-md-9">
                                                                                <TextArea
                                                                                    field={'newAccountpassphrse'}
                                                                                    placeholder={'Secret Phrase'}
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                className="col-sm-9 offset-sm-3 form-sub-title align-margin-top">
                                                                                Alphanumeric Characters Only
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="btn-box align-buttons-inside absolute right-conner">

                                                                {
                                                                    this.state.isCustomPassphraseTextarea &&
                                                                    <a
                                                                        onClick={() => {
                                                                            const {values} = getFormState();

                                                                            if (!values.newAccountpassphrse) {
                                                                                NotificationManager.error('Secret Phrase not specified.');
                                                                                return;
                                                                            }
                                                                            this.generatePassphrase(values.newAccountpassphrse)
                                                                        }}
                                                                        name={'closeModal'}
                                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                                    >
                                                                        Create account
                                                                    </a>
                                                                }
                                                                {
                                                                    !this.state.isCustomPassphraseTextarea &&
                                                                    <a
                                                                        onClick={() => this.generatePassphrase()}
                                                                        className="btn absolute btn-right blue round round-top-left round-bottom-right"
                                                                    >
                                                                        Create account
                                                                    </a>
                                                                }
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {
                                                        this.state.isCustomPassphraseForStandardWallet &&
                                                        <div className="form-group-app transparent">
                                                            <div className="form-title">
                                                                <p>Create Your Standard Wallet</p>
                                                            </div>
                                                            {
                                                                this.state.isRSAccountLoaded &&
                                                                <React.Fragment>
                                                                    <Text field={'option'} type={'hidden'}
                                                                          defaultValue={1}/>
                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div>
                                                                                    <InfoBox info>
                                                                                        <ul>
                                                                                            <li>You can log in to this
                                                                                                wallet using only your
                                                                                                secret phrase
                                                                                            </li>
                                                                                            <li>Available to use from
                                                                                                any device
                                                                                            </li>
                                                                                            <li>2FA is available only on
                                                                                                the device where it was
                                                                                                enabled
                                                                                            </li>
                                                                                        </ul>
                                                                                    </InfoBox>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
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
                                                                                        <strong>Remember</strong> to
                                                                                        store your Account ID and secret
                                                                                        phrase in a secured place.
                                                                                        Make sure to write down this
                                                                                        secret phrase and store it
                                                                                        securely (the secret phrase is
                                                                                        order and case sensitive). This
                                                                                        secret phrase is needed to use
                                                                                        your wallet.
                                                                                    </InfoBox>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12 mb-15">
                                                                                <label>Your randomly generated secret
                                                                                    phrase is:</label>
                                                                            </div>
                                                                            <div className="col-md-12">
                                                                                <div>
                                                                                    {
                                                                                        <InfoBox attentionLeft>
                                                                                            Secret Phrase: <span
                                                                                            className={'itatic'}>{this.state.generatedPassphrase}</span>
                                                                                            <br/>
                                                                                            <br/>
                                                                                            Account ID: <span
                                                                                            className={'itatic'}>{this.state.generatedAccount}</span>
                                                                                            <br/>
                                                                                            <br/>
                                                                                            <CopyToClipboard
                                                                                                text={
                                                                                                    `Secret Phrase: ${this.state.generatedPassphrase}\n` +
                                                                                                    `Account ID: ${this.state.generatedAccount}\n`
                                                                                                }
                                                                                                onCopy={() => {
                                                                                                    NotificationManager.success('The account data has been copied to clipboard.')
                                                                                                }}
                                                                                            >
                                                                                                <a
                                                                                                    className="btn blue static"
                                                                                                >
                                                                                                    Copy account data to
                                                                                                    clipboard.
                                                                                                </a>

                                                                                            </CopyToClipboard>
                                                                                            <br/>
                                                                                            <br/>
                                                                                            <a
                                                                                                className="btn blue static hide-media"
                                                                                                onClick={() => generatePDF([
                                                                                                    {
                                                                                                        name: 'Account ID',
                                                                                                        value: this.state.generatedAccount
                                                                                                    },
                                                                                                    {
                                                                                                        name: 'Secret Phrase',
                                                                                                        value: this.state.generatedPassphrase
                                                                                                    },
                                                                                                ])}
                                                                                            >
                                                                                                Print Wallet
                                                                                            </a>
                                                                                        </InfoBox>
                                                                                    }

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <Checkbox defaultValue={false}
                                                                                          field="losePhrase"/>
                                                                                <label>I wrote down my secret phrase. It
                                                                                    is now stored in a secured
                                                                                    place.</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="btn-box align-buttons-inside absolute right-conner">
                                                                        <a
                                                                            onClick={() => {
                                                                                if (!getFormState().values.losePhrase) {
                                                                                    NotificationManager.error('You have to verify that you stored your private data.', 'Error', 7000);
                                                                                    return;
                                                                                }
                                                                                this.setState({
                                                                                    ...this.state,
                                                                                    isValidating: true,
                                                                                    selectedOption: 1
                                                                                })
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
                                                                <ContentLoader/>
                                                            }
                                                        </div>
                                                    }
                                                </form>
                                            )}
                                        >
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                {
                    this.state.isValidating &&
                    <div className="modal-box">
                        <div className="modal-form">
                            <Form
                                onSubmit={(values) => this.handleFormSubmit(values)}
                                render={({
                                             submitForm, setValue, values, getFormState
                                         }) => (
                                    <form
                                        className={classNames({
                                            "form-group-app": true,
                                            "active": this.state.activeTab === 0
                                        })}
                                        onSubmit={submitForm}
                                    >
                                        <div className="form-title">
                                            <p>Create Your Wallet</p>
                                        </div>
                                        <div
                                            className="form-group row form-group-white mb-15"
                                            style={{marginBottom: 15}}
                                        >
                                            <label className="col-sm-3 col-form-label">
                                                Secret phrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                            </label>
                                            <div className="col-sm-9">
                                                <InputForm
                                                    isPlain
                                                    className={'form-control'}
                                                    type="password"
                                                    field="secretPhrase"
                                                    placeholder="Secret Phrase"
                                                    setValue={setValue}
                                                />
                                            </div>
                                        </div>
                                        <div className="btn-box align-buttons-inside absolute right-conner">
                                            {
                                                !!this.state.isPending ?
                                                    <div
                                                        style={{
                                                            width: 121.5
                                                        }}
                                                        className="btnbtn-right blue round round-bottom-right"
                                                    >
                                                        <div className="ball-pulse">
                                                            <div/>
                                                            <div/>
                                                            <div/>
                                                        </div>
                                                    </div> :
                                                    <button

                                                        type="submit"
                                                        name={'closeModal'}
                                                        className="btn btn-right blue round round-bottom-right"
                                                    >
                                                        Create New Account
                                                    </button>
                                            }
                                            <button
                                                type="button"
                                                name={'closeModal'}
                                                className="btn btn-right round round-top-left"
                                                onClick={this.handleGoBack}
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </form>
                                )}
                            />
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
