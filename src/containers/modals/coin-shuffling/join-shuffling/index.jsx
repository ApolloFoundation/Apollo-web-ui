/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import submitForm from "../../../../helpers/forms/forms";
import {
    setBodyModalParamsAction,
    setModalData,
    saveSendModalState,
    openPrevModal,
} from '../../../../modules/modals';
import {getBlockAction} from "../../../../actions/blocks";
import {NotificationManager} from "react-notifications";
import {getShufflingAction} from "../../../../actions/shuffling";
import crypto from "../../../../helpers/crypto/crypto";
import {generateAccountAction} from "../../../../actions/account";
import {processElGamalEncryption} from "../../../../actions/crypto";
import ModalBody from "../../../components/modals/modal-body";
import JoinShufflingForm from "./form.jsx";

class JoinShuffling extends React.Component {
    state = {};

    componentDidMount = () => {
        this.setRegisterUntil();
        this.getShuffling();

        NotificationManager.warning('Your secret phrase will be sent to the server!', 'Warning', 30000);
        NotificationManager.warning('Use the recipient\'s strong secret phrase and do not forget it!', 'Warning', 30000);
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', 'Attention', 30000);
    };

    handleFormSubmit = async(values) => {
        const data = {
            shufflingFullHash: this.props.modalData.broadcast ? this.props.modalData.broadcast.fullHash : this.state.shuffling.shufflingFullHash,
            secretPhrase: values.secretPhrase,
            createNoneTransactionMethod: true,
            code2FA: values.code2FA,
            feeATM: values.feeATM,
        };

        if (values.isVaultWallet) {
            data.recipientPublicKey = this.state.vaultWallet.publicKey;
        } else {
            data.recipientSecretPhrase = await processElGamalEncryption(values.recipientSecretPhrase);
            data.recipientPublicKey = await crypto.getPublicKeyAPL(values.recipientSecretPhrase, false);
        }

        this.setState({
            isPending: true
        });

        const res = await this.props.submitForm(data, 'startShuffler');
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
            shuffling: this.props.modalData,
        });

        if (shuffling) {
            this.setState({
                shuffling,
            });
        }
    };

    setRegisterUntil = async () => {
        const block = await this.props.getBlockAction();

        if (block) {
            this.setState({
                block,
            });
        }
    };

    setAccount = async (getFormState, setValue) => {
        const passphrase = getFormState().values.recipientSecretPhrase;

        const generatedAccount = await this.props.getAccountIdAsyncApl(passphrase);

        setValue('generatedAccount', generatedAccount);
    };

    handleVaultWalletCondition = async (condition) => {
        if (condition) {
            const vaultWallet = await generateAccountAction({});

            if (vaultWallet) {
                this.setState({
                    vaultWallet: {
                        accountRS: vaultWallet.currencies[0].wallets[0].address,
                        passphrase: vaultWallet.passphrase,
                        publicKey: vaultWallet.currencies[0].wallets[0].publicKey,
                    }
                })
            }
        }
    };

    render() {
        return (
            <ModalBody
                modalTitle='Start shuffling'
                closeModal={this.props.closeModal}
                handleFormSubmit={this.handleFormSubmit}
                isFee
                submitButtonName='Start Shuffling'
                idGroup='send-money-modal-'
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

const mapDispatchToProps = {
    submitForm: submitForm.submitForm,
    setModalData,
    getBlockAction,
    setBodyModalParamsAction,
    getAccountIdAsyncApl: crypto.getAccountIdAsyncApl,
    getShufflingAction,
    validatePassphrase: crypto.validatePassphrase,
    saveSendModalState,
    openPrevModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinShuffling);
