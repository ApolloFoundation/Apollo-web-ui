/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {
    openPrevModal,
    saveSendModalState,
    setAlert,
    setBodyModalParamsAction,
    setModalData
} from '../../../modules/modals';
import {getMixerAccount} from '../../../actions/transactions';
import crypto from '../../../helpers/crypto/crypto';
import {calculateFeeAction} from "../../../actions/forms";
import submitForm from "../../../helpers/forms/forms";
import ModalBody from "../../components/modals/modal-body";
import InfoBox from '../../components/info-box';
import SendPrivateApolloForm from "./form";

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
        if (!this.state.isPending) {
            if (!values.recipient) {
                NotificationManager.error('Recipient not specified.', 'Error', 5000);
                return;
            }
            if (!values.amountATM) {
                NotificationManager.error('Amount is required.', 'Error', 5000);
                return;
            }
            if (!values.feeATM) {
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
                    this.setState({isPending: false});
                });
        }
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
            <ModalBody
                modalTitle={'Send Apollo Private'}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                isAdvanced
                submitButtonName={'Send'}
                isDisabled={!this.state.isPrivateTransactionAlert}
                idGroup={'send-private-money-modal-'}
            >
                {!this.state.isPrivateTransactionAlert && (
                    <InfoBox info>
                        Private transactions currently protect down the the API level. Database level
                        protection will start with Olympus 2.0 <br/>
                        <button
                            type={'button'}
                            className={'btn btn-default mt-3'}
                            onClick={this.setConfirm}
                        >
                            I agree
                        </button>
                    </InfoBox>
                )}
                <SendPrivateApolloForm
                    useMixer={this.state.useMixer}
                    mixerData={this.state.mixerData}
                    handleUseMixer={this.handleUseMixer}
                />
            </ModalBody>
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
