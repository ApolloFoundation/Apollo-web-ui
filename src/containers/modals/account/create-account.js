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
            isAccountLoaded: false
        }
    };

    componentDidMount() {
        this.generateAccount();
        this.generatePassphrase();
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
    }

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

        console.log(values);
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
                    account: this.state.accountData.accountRS
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
                                    <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                    <div className="form-title">
                                        <p>Create new wallet</p>
                                    </div>

                                    <div className="form-tabulator active no-padding">
                                        <div className="form-tab-nav-box justify-left">
                                            <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                                "form-tab": true,
                                                "active": this.state.activeTab === 0
                                            })}>
                                                <p>Sure wallet</p>
                                            </a>
                                            <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                                "form-tab": true,
                                                "active": this.state.activeTab === 1
                                            })}>
                                                <p>Online wallet</p>
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
                                                        "active": this.state.activeTab === 0
                                                    })}
                                                    onSubmit={submitForm}
                                                >
                                                    {
                                                        !this.state.isValidating &&
                                                        <div className="form-group-app transparent">
                                                            <div className="form-title">
                                                                <p>Create your SURE wallet</p>
                                                            </div>

                                                            {
                                                                this.state.isAccountLoaded &&
                                                                <React.Fragment>


                                                                    <Text field={'option'} type={'hidden'} defaultValue={0}/>
                                                                    <div className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div>
                                                                                    <InfoBox info>
                                                                                        <ul className={'marked-list'}>
                                                                                            <li>                                                                                        More secure that Online Wallet.
                                                                                            </li>
                                                                                            <li>                                                                                         Protected with passphrase,
                                                                                            </li>
                                                                                            <li>                                                                                        Can be used only on node, on which it was creted
                                                                                            </li>
                                                                                            <li>                                                                                        Can be exported/imported to other nodes
                                                                                            </li>
                                                                                            <li>                                                                                        Wallet encrypted on the node.
                                                                                            </li>
                                                                                            <li>                                                                                        To log in You must know Account ID and passphrase.
                                                                                            </li>
                                                                                            <li>                                                                                        2FA works full-functional only on Sure Wallets.
                                                                                            </li>
                                                                                            <li>                                                                                        After creaition, store passphrase and wallet ID in safe place.
                                                                                            </li>
                                                                                        </ul>
                                                                                    </InfoBox>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

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
                                                                                this.setState({...this.state, isValidating: true, selectedOption: 0})
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
                                                        "active": this.state.activeTab === 1
                                                    })}
                                                    onSubmit={submitForm}
                                                >
                                                    {
                                                        !this.state.isValidating &&
                                                        <div className="form-group-app transparent">
                                                            <div className="form-title">
                                                                <p>Create your ONLINE wallet</p>
                                                            </div>
                                                            {
                                                                this.state.isAccountLoaded &&
                                                                <React.Fragment>
                                                                    <Text field={'option'} type={'hidden'} defaultValue={1}/>
                                                                    <div className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div>
                                                                                    <InfoBox info>
                                                                                        <ul>
                                                                                            <li>                                                                                        Protected with passphrase,
                                                                                            </li>
                                                                                            <li>                                                                                        Allows You to log in into wallet on any Apollo node.
                                                                                            </li>
                                                                                            <li>                                                                                        Online Wallet users can log in to wallet using only passphrase.
                                                                                            </li>
                                                                                            <li>                                                                                        2FA for online wallets avaliable only on that nodes where it was enabled.
                                                                                            </li>
                                                                                            <li>                                                                                        After creaition, store passphrase in safe place.
                                                                                            </li>
                                                                                        </ul>
                                                                                    </InfoBox>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12 mb-15">
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
                                                                    <div className="input-group-app display-block offset-bottom">
                                                                        <div className="row">
                                                                            <div className="col-md-12 mb-15">
                                                                                <label>
                                                                                    Write down this passphrase and store securely (order and
                                                                                    capitalization matter). This passphrase will be needed to use your
                                                                                    wallet.
                                                                                </label>
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
                                                                                        {this.state.generatedAccount}
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
                                                                                this.setState({...this.state, isValidating: true, selectedOption: 1})
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
                                            "tab-body": true,
                                            "active": this.state.activeTab === 0
                                        })}
                                        onSubmit={submitForm}
                                    >

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
