/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Text} from 'react-form';
import classNames from 'classnames';
import {NotificationManager} from "react-notifications";
import {
    openPrevModal,
    saveSendModalState,
    setAlert,
    setBodyModalParamsAction,
    setModalData
} from '../../../modules/modals';
import {getMixerAccount} from '../../../actions/transactions';
import NummericInputForm from "../../components/form-components/numeric-input";
import AccountRS from '../../components/account-rs';
import InputForm from '../../components/input-form';
import InfoBox from '../../components/info-box';
import ModalFooter from '../../components/modal-footer';
import crypto from '../../../helpers/crypto/crypto';
import {calculateFeeAction} from "../../../actions/forms";
import submitForm from "../../../helpers/forms/forms";
import BackForm from '../modal-form/modal-form-container';
import {CheckboxFormInput} from "../../components/form-components/check-button-input";
import AccountRSFormInput from "../../components/form-components/account-rs";

class SendApolloPrivate extends React.Component {
    state = {
        activeTab: 0,
        advancedState: false,

        // submitting
        passphraseStatus: false,
        recipientStatus: false,
        amountStatus: false,
        feeStatus: false,
        isPrivateTransactionAlert: false,
        useMixer: false,
    };

    componentDidMount() {
        this.handleGetMixerAccount();
    };

    handleGetMixerAccount = async () => {
        const mixerData = await getMixerAccount();
        if (mixerData && mixerData.rsId) {
            const mixerAccount = mixerData.rsId;
            mixerData.rsId = mixerAccount.replace('APL-', `${this.props.accountPrefix}-`);

            this.setState({
                mixerData,
                useMixer: true,
            })
        }
    };

    handleFormSubmit = async (values) => {
        if (!values.recipient) {
            this.setState({
                isPending: false
            });
            NotificationManager.error('Recipient not specified.', 'Error', 5000);
            return;
        }
        if (!values.amountATM) {
            this.setState({
                isPending: false
            });
            NotificationManager.error('Amount is required.', 'Error', 5000);
            return;
        }
        if (!values.feeATM) {
            this.setState({
                isPending: false
            });
            NotificationManager.error('Fee not specified.', 'Error', 5000);
            return;
        }

        if (this.state.useMixer) {
            values.messageToEncrypt = JSON.stringify({
                name: "REQUEST_MIXING",
                epicId: values.recipient,
                approximateMixingDuration: values.duration  // Minutes 
            });

            if (values.amountATM < 100) {
                NotificationManager.error('Minimal amountATM shold exceed 100 Apollo while using mixer.', 'Error', 5000);
                return;
            }

            if (values.duration < 15) {
                NotificationManager.error('Mixing duration should downplay 15 minutes.', 'Error', 5000);
                return;
            }

            if (values.duration > 11000) {
                NotificationManager.error('Mixing duration should exceed 11000 minutes.', 'Error', 5000);
                return;
            }

            values.recipient = values.mixerAccount;
            values.recipientPublicKey = values.mixerPublicKey;

            delete values.mixerAccount;
        }

        this.setState({isPending: true});

        this.props.dispatch(await this.props.submitForm(values, 'sendMoneyPrivate'))
            .done((privateTransaction) => {
                if (privateTransaction && privateTransaction.errorCode) {
                    NotificationManager.error(privateTransaction.errorDescription, 'Error', 5000);

                } else {
                    NotificationManager.success('Private transaction has been submitted.', null, 5000);
                    this.props.setBodyModalParamsAction(null, {});
                }
            })
    };

    handleAdvancedState = () => {
        if (this.state.advancedState) {
            this.setState({advancedState: false});
        } else {
            this.setState({advancedState: true});
        }
    };

    setConfirm = () => {
        this.setState({isPrivateTransactionAlert: true});
    };

    handleUseMixer = (e) => {
        this.setState({useMixer: e});
    };

    render() {
        return (
            <div className="modal-box">
                <BackForm
                    nameModal={this.props.nameModal}
                    onSubmit={(values) => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, values, addValue, removeValue, setValue, getFormState, getValue
                             }) => (
                        <form className="modal-form" onChange={() => this.props.saveSendModalState(values)}
                              onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i
                                    className="zmdi zmdi-close"/></a>

                                <div className="form-title">
                                    {this.props.modalsHistory.length > 1 &&
                                    <div className={"backMy"} onClick={() => {
                                        this.props.openPrevModal()
                                    }}/>
                                    }
                                    <p>Send Apollo Private</p>
                                </div>
                                {
                                    !this.state.isPrivateTransactionAlert &&
                                    <InfoBox info>
                                        Private transactions currently protect down the the API level. Database level
                                        protection will start with Olympus 2.0 <br/>
                                        <a
                                            className={'btn static primary'}
                                            style={{background: '#fff', color: '#00C8FF'}}
                                            onClick={this.setConfirm}
                                        >
                                            I agree
                                        </a>
                                    </InfoBox>
                                }
                                <AccountRSFormInput
                                    field={'recipient'}
                                    defaultValue={values.recipient || ''}
                                    label={'Recipient'}
                                    placeholder={'Recipient'}
                                    setValue={setValue}
                                />
                                {
                                    this.state.useMixer &&
                                    <React.Fragment>
                                        <Text
                                            type="hidden"
                                            field="mixerAccount"
                                            defaultValue={this.state.mixerData && this.state.mixerData.rsId}
                                        />
                                        <Text
                                            type="hidden"
                                            field="mixerPublicKey"
                                            defaultValue={this.state.mixerData && this.state.mixerData.publicKey}
                                        />
                                    </React.Fragment>
                                }
                                {
                                    this.state.useMixer &&
                                    <InfoBox info>
                                        Your money will be sent directly to mixer account and during estimated mixing
                                        time, money will be transmitted to recipient account.
                                    </InfoBox>
                                }
                                <NummericInputForm
                                    defaultValue={(this.props.modalData && this.props.modalData.amountATM) ? this.props.modalData.amountATM : ''}
                                    field={'amountATM'}
                                    counterLabel={'Apollo'}
                                    type={'float'}
                                    label={'Amount'}
                                    setValue={setValue}
                                    placeholder={'Amount'}
                                />
                                {this.state.mixerData && (
                                    <CheckboxFormInput
                                        setValue={setValue}
                                        checkboxes={[
                                            {
                                                field: 'isMixer',
                                                label: 'Use Mixer',
                                                defaultValue: this.state.useMixer,
                                                handler: this.handleUseMixer,
                                            }
                                        ]}
                                    />
                                )}
                                {this.state.useMixer && (
                                    <NummericInputForm
                                        defaultValue={(this.props.modalData && this.props.modalData.amountATM) ? this.props.modalData.amountATM : ''}
                                        field={'duration'}
                                        counterLabel={'Minutes'}
                                        type={'float'}
                                        label={'Mixing time'}
                                        setValue={setValue}
                                        placeholder={'Duration'}
                                    />
                                )}
                                <NummericInputForm
                                    field={'feeATM'}
                                    counterLabel={'Apollo'}
                                    type={'float'}
                                    label={'Fee'}
                                    setValue={setValue}
                                    placeholder={'Fee'}
                                    defaultValue={(this.props.modalData && this.props.modalData.feeATM) || '5'}
                                />
                                <ModalFooter
                                    setValue={setValue}
                                    getFormState={getFormState}
                                    values={values}
                                />
                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorrect secret phrase.
                                    </InfoBox>
                                }
                                {
                                    this.state.recipientStatus &&
                                    <InfoBox danger mt>
                                        Incorrect recipient.
                                    </InfoBox>
                                }
                                {
                                    this.state.amountStatus &&
                                    <InfoBox danger mt>
                                        Missing amount.
                                    </InfoBox>
                                }
                                {
                                    this.state.feeStatus &&
                                    <InfoBox danger mt>
                                        Missing fee.
                                    </InfoBox>
                                }

                                <div className="btn-box right-conner align-right">
                                    <a
                                        onClick={() => this.props.closeModal()}
                                        className="btn btn-default mr-3"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        name={'closeModal'}
                                        className={classNames({
                                            "btn" : true,
                                            "btn-right" : true,
                                            "btn-green" : true,
                                            "submit-button" : true,
                                            "btn-green-disabled": !this.state.isPrivateTransactionAlert
                                        })}
                                    >
                                        Send
                                    </button>

                                </div>
                            </div>
                        </form>
                    )}
                >
                </BackForm>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    modalData: state.modals.modalData,
    publicKey: state.account.publicKey,
    modalsHistory: state.modals.modalsHistory,
    accountPrefix: state.account.constants ? state.account.constants.accountPrefix : ''
});

const mapDispatchToProps = dispatch => ({
    setAlert: (status, message) => dispatch(setAlert(status, message)),
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    calculateFeeAction: (requestParams) => dispatch(calculateFeeAction(requestParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    openPrevModal: () => dispatch(openPrevModal()),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SendApolloPrivate);
