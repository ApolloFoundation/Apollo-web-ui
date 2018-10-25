/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import AdvancedSettings from '../../components/advanced-transaction-settings';
import InputForm from '../../components/input-form';
import {Form, Text} from 'react-form';
import {getBlockAction} from "../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../helpers/forms/forms";
import {getShufflingAction} from "../../../actions/shuffling/";

import store from '../../../store'
import crypto from "../../../helpers/crypto/crypto";
import ModalFooter from '../../components/modal-footer'


class JoinShuffling extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            advancedState: false,

            // submitting
            passphraseStatus: false,
            recipientStatus: false,
            amountStatus: false,
            feeStatus: false
        }

    }

    handleFormSubmit = async(values) => {
        const data = {
            shufflingFullHash: this.props.modalData.broadcast ? this.props.modalData.broadcast.fullHash : this.state.shuffling.shufflingFullHash,
            recipientSecretPhrase: values.recipientSecretPhrase,
            secretPhrase: values.secretPhrase,
            recipientPublicKey: await crypto.getPublicKeyAPL(values.recipientSecretPhrase, false),
            createNoneTransactionMethod: true,
            code2FA: values.code2FA
        };

        this.setState({
            isPending: true
        })

        const res = await this.props.submitForm( data, 'startShuffler');
        if (res.errorCode) {
            this.setState({
                isPending: false
            })
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            this.props.setBodyModalParamsAction(null, {});

            NotificationManager.success('Shuffling Started!', null, 5000);
        }
    };

    getShuffling = async () => {
        const shuffling = await this.props.getShufflingAction({
            shuffling: this.props.modalData
        });

        if (shuffling) {
            this.setState({
                shuffling
            });
        }
    };


    componentDidMount = () => {
        this.setRegisterUntil();
        this.getShuffling();

        NotificationManager.warning('Your passphrase will be sent to the server!', 'Warning', 30000);
        NotificationManager.warning('Use a strong recipient passphrase and do not forget it !', 'Warning', 30000);
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', 'Attention', 30000);

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

    setRegisterUntil = async () => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block
            });
        }
    };

    setAccount = async (getFormState, setValue) => {
        const passphrase = getFormState().values.recipientSecretPhrase;

        const generatedAccount = store.dispatch(await this.props.getAccountIdAsyncApl(passphrase));

        setValue('generatedAccount', generatedAccount);
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue, getFormState, values
                             }) => (
                        <form className="modal-form" onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Start shuffling</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Shuffling Id
                                    </label>
                                    <div className="col-sm-9">
                                        {this.state.shuffling &&
                                        <p>{this.state.shuffling.shuffling}</p>
                                        }
                                        {this.props.modalData && this.props.modalData.broadcast &&
                                            <p>{this.props.modalData.broadcast.transaction}</p>
                                        }
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Recipient Passphrase
                                    </label>
                                    <div className="col-sm-9">
                                        <Text className="form-control"
                                              field="recipientSecretPhrase"
                                              placeholder="Account ID"
                                              onKeyUp={(e) => {
                                                  if (getFormState().values.recipientSecretPhrase !== '') {
                                                      this.setAccount(getFormState, setValue)
                                                  } else {
                                                      setValue('generatedAccount', '')
                                                  }
                                              }}
                                              type={'password'}/>
                                    </div>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Recipient Account
                                    </label>
                                    <div className="col-sm-9 mb-0">
                                        <InputForm
                                            disabled={true}
                                            field="generatedAccount"
                                            placeholder="Account ID"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                {/*<AdvancedSettings
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                    advancedState={this.state.advancedState}
                                />*/}
                                <div className="btn-box align-buttons-inside absolute right-conner align-right">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn round round-top-left"
                                    >
                                        Cancel
                                    </a>
                                    {
                                        !!this.state.isPending ?
                                            <div
                                                style={{
                                                    width: 100
                                                }}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                <div className="ball-pulse">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div> :
                                            <button
                                                style={{
                                                    width: 100
                                                }}
                                                type="submit"
                                                name={'closeModal'}
                                                className="btn btn-right blue round round-bottom-right"
                                            >
                                                Start Shuffling
                                            </button>
                                    }

                                </div>
                            </div>
                        </form>
                    )}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getShufflingAction: (reqParams) => dispatch(getShufflingAction(reqParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinShuffling);
