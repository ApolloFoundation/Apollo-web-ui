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
import InputForm from '../../../components/input-form';
import InfoBox from '../../../components/info-box';
import ContentLoader from '../../../components/content-loader'
import {setAlert, setBodyModalParamsAction, setModalData} from "../../../../modules/modals";
import submitForm from "../../../../helpers/forms/forms";
import crypto from '../../../../helpers/crypto/crypto';
import store from '../../../../store'
import {getAccountDataAction} from "../../../../actions/login";
import {createAccountAction, generateAccountAction, generatePDF} from '../../../../actions/account';

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

    componentWillReceiveProps(newProps) {
        if (newProps.account) {
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

    generateAccount = async (getFormState) => {
        const requestParams = {};
        if (this.state.isCustomPassphraseTextarea) {
            const {values} = getFormState();
            requestParams.passphrase = values.newAccountpassphrse;
            if (!requestParams.passphrase) {
                NotificationManager.error('Secret Phrase not specified.');
                return;
            }
        }

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

    generatePassphrase = async (getFormState) => {
        let passphrase;
        if (this.state.isCustomPassphraseTextarea) {
            const {values} = getFormState();
            passphrase = values.newAccountpassphrse;
            if (!passphrase) {
                NotificationManager.error('Secret Phrase not specified.');
                return;
            }
        }

        const generatedPassphrase = passphrase ? passphrase : crypto.generatePassPhraseAPL();
        const generatedAccount = store.dispatch(await this.props.getAccountIdAsyncApl(passphrase ? passphrase : generatedPassphrase.join(' ')));

        this.setState({
            ...this.state,
            generatedPassphrase: passphrase ? passphrase : generatedPassphrase.join(' '),
            generatedAccount: generatedAccount,
            isRSAccountLoaded: true,
            isCustomPassphraseForStandardWallet: true,
        })
    };


    render() {
        return (
            <div className="dark-card">
                <a onClick={this.props.handleClose} className="exit">
                    <i className="zmdi zmdi-close"/>
                </a>
                <p className="title">Create New Wallet</p>
                {!this.state.isValidating ? (
                    <div className="form-tabulator no-padding">
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
                                <p><i className="zmdi zmdi-shield-security"/> Vault Wallet</p>
                            </a>
                        </div>

                        <Form
                            onSubmit={this.handleFormSubmit}
                            render={({submitForm, setValue, getFormState}) => (
                                <form
                                    className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 1
                                    })}
                                    onSubmit={submitForm}
                                >
                                    <InfoBox className={'dark-info'}>
                                        <ul className={'marked-list'}>
                                            <li className={'check-icon'}>The most secure Apollo Wallet.</li>
                                            <li className={'check-icon'}>You can log in to this wallet using your
                                                Account ID.
                                            </li>
                                            <li className={'check-icon'}>The wallet is encrypted (via Secret Key) on one
                                                device.
                                            </li>
                                            <li className={'check-icon'}>You can export/import your Secret Key to use on
                                                other devices.
                                            </li>
                                            <li className={'check-icon'}>2FA works from any device when you use your
                                                Vault.
                                            </li>
                                            <li className={'minus-icon'}>If you loose your device before export your
                                                security key you will not be able to access your wallet.
                                            </li>
                                        </ul>
                                    </InfoBox>
                                    {this.state.isCustomPassphrase ? (
                                        <div>
                                            <InfoBox>
                                                You can create your own custom secret
                                                phrase or create an account with a
                                                randomly generated secret phrase.
                                            </InfoBox>
                                            <div className={'checkbox-group'}>
                                                <Checkbox
                                                    className={'lighten'}
                                                    field="isCustomPassphrase"
                                                    onChange={(e) => this.setState({isCustomPassphraseTextarea: !!e})}
                                                />
                                                <label>
                                                    Use custom secret phrase
                                                </label>
                                            </div>
                                            {this.state.isCustomPassphraseTextarea && (
                                                <div className="form-group row form-group-grey mb-15">
                                                    <label>
                                                        Your account secret phrase
                                                    </label>
                                                    <TextArea
                                                        field={'newAccountpassphrse'}
                                                        placeholder={'Secret Phrase'}
                                                    />
                                                </div>
                                            )}
                                            <button
                                                type={'button'}
                                                onClick={() => this.generateAccount(getFormState)}
                                                className="btn"
                                            >
                                                Create account
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            {this.state.isAccountLoaded ? (
                                                <React.Fragment>
                                                    <Text field={'option'} type={'hidden'} defaultValue={0}/>

                                                    <InfoBox className={'dark-info'}>
                                                        <ul className={'marked-list'}>
                                                            <li className={'danger-icon'}>
                                                                <strong>Remember</strong> to store your Account ID and
                                                                secret phrase in a secured place. Make sure to write
                                                                down this secret phrase and store it securely (the
                                                                secret phrase is order and case sensitive). This secret
                                                                phrase is needed to use your wallet.
                                                            </li>
                                                        </ul>
                                                    </InfoBox>

                                                    {
                                                        this.state.keySeed &&
                                                        this.state.accountData &&
                                                        this.state.keySeed.secretBytes && (
                                                            <InfoBox attentionLeft className={'dark-info'}>
                                                                <p className={'mb-3'}>
                                                                    Your {!this.state.isCustomPassphraseTextarea && 'randomly generated'} secret
                                                                    phrase is:
                                                                </p>
                                                                <p className={'mb-3'}>
                                                                    Secret Phrase:
                                                                    <span
                                                                        className={'itatic'}>{this.state.accountData.passphrase}</span>
                                                                </p>
                                                                <p className={'mb-3'}>
                                                                    Account ID:
                                                                    <span
                                                                        className={'itatic'}>{this.state.accountData.accountRS}</span>
                                                                </p>
                                                                <p className={'mb-3'}>
                                                                    Public Key:
                                                                    <span
                                                                        className={'itatic word-brake-for-info'}>{this.state.accountData.publicKey}</span>
                                                                </p>
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
                                                                    <button type={'button'} className="btn btn-sm">
                                                                        Copy account data to clipboard
                                                                    </button>

                                                                </CopyToClipboard>
                                                                <button
                                                                    type={'button'}
                                                                    className="btn btn-sm"
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
                                                        )}
                                                    <div className={'checkbox-group'}>
                                                        <Checkbox
                                                            defaultValue={false}
                                                            field="losePhrase"
                                                        />
                                                        <label>
                                                            I wrote down my Account ID, Secret phrase. It is now stored
                                                            in a secured place.
                                                        </label>
                                                    </div>
                                                    <button
                                                        type={'submit'}
                                                        className="btn"
                                                        onClick={() => {
                                                            if (!getFormState().values.losePhrase) {
                                                                NotificationManager.error('You have to verify that you stored your private data', 'Error', 7000);
                                                                return;
                                                            }
                                                            this.setState({
                                                                isValidating: true,
                                                                selectedOption: 0
                                                            })
                                                        }}
                                                    >
                                                        Next
                                                    </button>
                                                </React.Fragment>
                                            ) : (
                                                <ContentLoader/>
                                            )}

                                        </div>
                                    )}
                                    {
                                        this.state.isValidating && (
                                            <div>
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

                                                <div className="btn-box align-buttons-inside absolute right-conner">
                                                    {!!this.state.isPending ?
                                                        <div
                                                            style={{
                                                                width: 121.5
                                                            }}
                                                            className="btn btn-right blue round round-top-left round-bottom-right"
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
                                                            className="btn"
                                                        >
                                                            Create New Account
                                                        </button>
                                                    }
                                                    <button
                                                        type="button"
                                                        name={'closeModal'}
                                                        className="btn"
                                                        onClick={this.props.handleClose}
                                                    >
                                                        Back
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                </form>
                            )}
                        >
                        </Form>
                        <Form
                            onSubmit={this.handleValidateToken}
                            render={({submitForm, getFormState}) => (
                                <form
                                    className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 0
                                    })}
                                    onSubmit={submitForm}
                                >
                                    <InfoBox className={'dark-info marked-list'}>
                                        <ul>
                                            <li className={'check-icon'}>You can log in to this wallet using only your
                                                secret phrase
                                            </li>
                                            <li className={'check-icon'}>Available to use from any device</li>
                                            <li className={'minus-icon'}>2FA is available only on the device where it
                                                was enabled
                                            </li>
                                        </ul>
                                    </InfoBox>
                                    {!this.state.isCustomPassphraseForStandardWallet ? (
                                        <React.Fragment>
                                            <div>
                                                <InfoBox>
                                                    You can create your own custom secret
                                                    phrase or create an account with a
                                                    randomly generated secret phrase.
                                                </InfoBox>
                                                <div className={'checkbox-group'}>
                                                    <Checkbox
                                                        className={'lighten'}
                                                        field="isCustomPassphrase"
                                                        onChange={(e) => this.setState({isCustomPassphraseTextarea: !!e})}
                                                    />
                                                    <label>
                                                        Use custom secret phrase
                                                    </label>
                                                </div>
                                                {this.state.isCustomPassphraseTextarea && (
                                                    <div className="form-group row form-group-grey mb-15">
                                                        <label>
                                                            Your account secret phrase
                                                        </label>
                                                        <TextArea
                                                            field={'newAccountpassphrse'}
                                                            placeholder={'Secret Phrase'}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type={'button'}
                                                onClick={() => this.generatePassphrase(getFormState)}
                                                className="btn"
                                            >
                                                Create account
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <div>
                                            {this.state.isRSAccountLoaded ? (
                                                <React.Fragment>
                                                    <Text field={'option'} type={'hidden'}
                                                          defaultValue={1}/>
                                                    <InfoBox className={'dark-info'}>
                                                        <ul className={'marked-list'}>
                                                            <li className={'danger-icon'}>
                                                                <strong>Remember</strong> to
                                                                store your Account ID and secret
                                                                phrase in a secured place.
                                                                Make sure to write down this
                                                                secret phrase and store it
                                                                securely (the secret phrase is
                                                                order and case sensitive). This
                                                                secret phrase is needed to use
                                                                your wallet.
                                                            </li>
                                                        </ul>
                                                    </InfoBox>

                                                    {this.state.generatedPassphrase && (
                                                        <InfoBox attentionLeft className={'dark-info'}>
                                                            <p className={'mb-3'}>
                                                                Your {!this.state.isCustomPassphraseTextarea && 'randomly generated'} secret
                                                                phrase is:
                                                            </p>
                                                            <p className={'mb-3'}>
                                                                Secret Phrase: <span
                                                                className={'itatic'}>{this.state.generatedPassphrase}</span>
                                                            </p>
                                                            <p className={'mb-3'}>
                                                                Account ID: <span
                                                                className={'itatic'}>{this.state.generatedAccount}</span>
                                                            </p>
                                                            <CopyToClipboard
                                                                text={
                                                                    `Secret Phrase: ${this.state.generatedPassphrase}\n` +
                                                                    `Account ID: ${this.state.generatedAccount}\n`
                                                                }
                                                                onCopy={() => {
                                                                    NotificationManager.success('The account data has been copied to clipboard.')
                                                                }}
                                                            >
                                                                <button type={'button'} className="btn btn-sm">
                                                                    Copy account data to clipboard
                                                                </button>
                                                            </CopyToClipboard>
                                                            <button
                                                                type={'button'}
                                                                className="btn btn-sm"
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
                                                            </button>
                                                        </InfoBox>
                                                    )}
                                                    <div className={'checkbox-group'}>
                                                        <Checkbox
                                                            defaultValue={false}
                                                            field="losePhrase"
                                                        />
                                                        <label>
                                                            I wrote down my secret phrase. It
                                                            is now stored in a secured
                                                            place.
                                                        </label>
                                                    </div>
                                                    <button
                                                        type={'submit'}
                                                        className="btn"
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
                                                    >
                                                        Next
                                                    </button>
                                                </React.Fragment>
                                            ) : (
                                                <ContentLoader/>
                                            )}
                                        </div>
                                    )}
                                </form>
                            )}
                        >
                        </Form>
                    </div>
                ) : (
                    <Form
                        onSubmit={this.handleFormSubmit}
                        render={({submitForm, setValue}) => (
                            <form
                                className={'active'}
                                onSubmit={submitForm}
                            >
                                <div
                                    className="form-group row form-group-white"
                                >
                                    <label>
                                        Secret phrase
                                    </label>
                                    <InputForm
                                        isPlain
                                        className={'form-control'}
                                        type="password"
                                        field="secretPhrase"
                                        placeholder="Secret Phrase"
                                        setValue={setValue}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    name={'closeModal'}
                                    className="btn"
                                    disabled={!!this.state.isPending}
                                >
                                    {!!this.state.isPending ? (
                                        <div className="ball-pulse">
                                            <div/>
                                            <div/>
                                            <div/>
                                        </div>
                                    ) : (
                                        <span>Create New Account</span>
                                    )}
                                </button>
                            </form>
                        )}
                    />
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
