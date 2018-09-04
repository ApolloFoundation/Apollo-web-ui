import React from 'react';
import {connect} from 'react-redux';
import {setModalData} from '../../../modules/modals';
import classNames from 'classnames';
import AdvancedSettings from '../../components/advanced-transaction-settings'
import {Form, Text, TextArea} from 'react-form'
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";
import InfoBox from '../../components/info-box'
import {validateTokenAction} from "../../../actions/account";
import {NotificationManager} from 'react-notifications';

import QRCode from 'qrcode.react';


class TokenGenerationValidation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            generatedToken: null,
            validateToken: null
        };

        this.handleTab = this.handleTab.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    handleFormSubmit = async (values) => {
        const isPassphrase = await this.props.validatePassphrase(values.secretPhrase);

        if (!isPassphrase) {
            this.setState({
                ...this.props,
                passphraseStatus: true
            })
            return;
        } else {
            this.setState({
                ...this.props,
                passphraseStatus: false
            })
        }



        const token = await this.props.generateToken(values.data, values.secretPhrase);

        this.setState({
            ...this.state,
            generatedToken: token
        })
    };

    handleValidateToken = async (values) => {
        const validateToken = await this.props.validateTokenAction({
            token: values.token,
            website: values.website
        })

        if (validateToken) {
            if (validateToken.valid) {
                NotificationManager.success('Notification message is valid!')
            } else {
                NotificationManager.error('Notification message is invalid!')
            }
        }
    };

    render() {
        return (
            <div className="modal-box">
                <div className="modal-form">
                    <div className="form-group">
                        <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                        <div className="form-title">
                            <p>Token generation / validation</p>
                        </div>

                        <div className="form-tabulator active">
                            <div className="form-tab-nav-box justify-left">
                                <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                    "form-tab": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    <p>Generate token</p>
                                </a>
                                <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                    "form-tab": true,
                                    "active": this.state.activeTab === 1
                                })}>
                                    <p>Validate token</p>
                                </a>
                            </div>

                            <Form
                                onSubmit={(values) => this.handleFormSubmit(values)}
                                render={({
                                             submitForm
                                         }) => (
                                <form
                                    className={classNames({
                                        "tab-body": true,
                                        "active": this.state.activeTab === 0
                                    })}
                                    onSubmit={submitForm}
                                >
                                    {
                                        this.state.generatedToken &&
                                            [
                                                <p style={{marginBottom: 18}}>The generated token is:</p>,
                                                <InfoBox info>
                                                    <div className="token word-brake">{this.state.generatedToken}</div>
                                                </InfoBox>,
                                                <div className="qr-code-image">
                                                    <QRCode value={this.state.generatedToken} size={100} />
                                                </div>
                                            ]

                                    }

                                        <div className="input-group block offset-bottom offset-top">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Data</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'data'} placeholder="Website or text"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group block">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Passphrase</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text type="text" field={'secretPhrase'} placeholder="passphrase"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="btn-box align-buttons-inside absolute right-conner">
                                            <button
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Generate
                                            </button>
                                            <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>


                                        </div>
                                    </form>
                                )}
                            >
                            </Form>
                            <Form
                                onSubmit={(values) => this.handleValidateToken(values)}
                                render={({
                                             submitForm
                                         }) => (
                                    <form
                                        className={classNames({
                                            "tab-body": true,
                                            "active": this.state.activeTab === 1
                                        })}
                                        onSubmit={submitForm}
                                    >

                                        {
                                            this.state.validateToken &&
                                            <InfoBox danger>

                                            </InfoBox>
                                        }

                                        <div className="input-group block offset-bottom offset-top">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Website</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <TextArea rows={5} type="text" field={'website'} placeholder="Website or text"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-group block">

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label>Token</label>
                                                </div>
                                                <div className="col-md-9">
                                                    <Text type="text" field={'token'} placeholder="passphrase"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-box align-buttons-inside absolute right-conner">
                                            <button
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Validate
                                            </button>
                                            <a onClick={() => this.props.closeModal()} className="btn btn-right round round-top-left">Cancel</a>

                                        </div>
                                    </form>
                                )}
                            >
                        </Form>
                        </div>
                        <AdvancedSettings advancedState={this.state.advancedState} white/>
                    </div>

                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    generateToken: (message, secretPhrase) => dispatch(converters.generateToken(message, secretPhrase)),
    validatePassphrase: (passPhrase) => dispatch(crypto.validatePassphrase(passPhrase)),
    validateTokenAction: (requestParams) => dispatch(validateTokenAction(requestParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenGenerationValidation);
