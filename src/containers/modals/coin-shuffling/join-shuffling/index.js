/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, saveSendModalState, openPrevModal} from '../../../../modules/modals';
import AdvancedSettings from '../../../components/advanced-transaction-settings';
import InputForm from '../../../components/input-form';
import {Checkbox, Form, Text} from 'react-form';
import {getBlockAction} from "../../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import submitForm from "../../../../helpers/forms/forms";
import {getShufflingAction} from "../../../../actions/shuffling/";

import store from '../../../../store'
import crypto from "../../../../helpers/crypto/crypto";
import ModalFooter from '../../../components/modal-footer'

import BackForm from '../../modal-form/modal-form-container';
import InfoBox from "../../../components/info-box";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {generateAccountAction} from "../../../../actions/account";
import NummericInputForm from "../../../components/form-components/numeric-input";
import {CheckboxFormInput} from "../../../components/form-components/check-button-input";
import ModalBody from "../../../components/modals/modal-body";
import JoinShufflingForm from "./form";

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
        let data = {
            shufflingFullHash: this.props.modalData.broadcast ? this.props.modalData.broadcast.fullHash : this.state.shuffling.shufflingFullHash,
            recipientSecretPhrase: values.recipientSecretPhrase,
            secretPhrase: values.secretPhrase,
            recipientPublicKey: await crypto.getPublicKeyAPL(values.recipientSecretPhrase, false),
            createNoneTransactionMethod: true,
            code2FA: values.code2FA,
            feeATM: values.feeATM,
        };

        if (values.isVaultWallet) {
            data.recipientAccount = this.state.vaultWallet.accountRS;
            data.recipientPassphrase = this.state.vaultWallet.passphrase;

            delete data.recipientSecretPhrase;
        }

        this.setState({
            isPending: true
        });

        const res = await this.props.submitForm( data, 'startShuffler');
        if (res.errorCode) {
            this.setState({
                isPending: false
            });
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

        NotificationManager.warning('Your secret phrase will be sent to the server!', 'Warning', 30000);
        NotificationManager.warning('Use the recipient\'s strong secret phrase and do not forget it!', 'Warning', 30000);
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

    handleVaultWalletCondition = async (condition) => {
        if (condition) {
            const vaultWallet = await generateAccountAction({});

            if (vaultWallet) {
                this.setState({
                    vaultWallet
                })
            }
        }
    };


    render() {
        return (
            <ModalBody
                modalTitle={'Start shuffling'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                isFee
                submitButtonName={'Start Shuffling'}
                idGroup={'send-money-modal-'}
            >
                <JoinShufflingForm
                    setAccount={this.setAccount}
                    handleVaultWalletCondition={this.handleVaultWalletCondition}
                    shuffling={this.state.shuffling}
                    vaultWallet={this.state.vaultWallet}
            />
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
    setModalData: (data) => dispatch(setModalData(data)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getAccountIdAsyncApl: (passPhrase) => dispatch(crypto.getAccountIdAsyncApl(passPhrase)),
    getShufflingAction: (reqParams) => dispatch(getShufflingAction(reqParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    saveSendModalState: (Params) => dispatch(saveSendModalState(Params)),
    openPrevModal: () => dispatch(openPrevModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinShuffling);
