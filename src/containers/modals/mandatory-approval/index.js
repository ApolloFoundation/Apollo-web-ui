import React from "react";
import Modal from "./components/Modal";
import Message from "./components/Message";
import ModalTabs from "./components/ModalTabs";
import Tab from "./components/Tab";
import SubmitButton from "./components/SubmitButton";
import CancelButton from "./components/CancelButton";
import ModalFooter from "./components/ModalFooter";
import NoApprovalBody from "./body/NoApprovalBody";
import ApproveByAccountBody from "./body/ApproveByAccountBody";
import ApproveByBalanceBody from "./body/ApproveByBalanceBody";
import ApproveWithAssetBody from "./body/ApproveWithAssetBody";
import ApproveWithCurrencyBody from "./body/ApproveWithCurrencyBody";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import submitForm from "../../../helpers/forms/forms";

import ModalBody from '../../components/modals/modal-body';
import TabulationBody from '../../components/tabulator/tabuator-body';
import TabContaier from '../../components/tabulator/tab-container';


//TODO: extract to constants
const tabs = [
    "No approval",
    "Approve by account",
    "Approve by balance",
    "Approve with asset",
    "Approve with currency",
];

class MandatoryApprovalModal extends React.Component {

    state = {
        activeForm: 0,
        noApproval: null,
        approveByAcc: null,
        approveByBalance: null,
        approveWithAsset: null,
        approveWithCurrency: null,
    };

    tabSelected = tabIndex => {
        this.setState({
            activeTab: tabIndex
        })
    };

    submitNoApproval = async toSend => {
        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const mappedRequestBody = {
            controlVotingModel: -1,
            controlMinDuration: null,
            controlMaxDuration: null,
            phased: false,
            phasingLinkedFullHash: null,
            phasingHashedSecret: null,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            secretPhrase: toSend.secretPhrase,
            feeATM: toSend.fee,
            controlMaxFees: 0,
            ...toSend
        };
        const res = await this.props.submitForm(mappedRequestBody, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveByAcc = async toSend => {
        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const mappedRequestBody = {
            controlQuorum: toSend.phasingQuorum,
            controlMinBalanceModel: toSend.phasingMinBalanceModel,
            controlVotingModel: 0,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
            secretPhrase: toSend.secretPhrase,
            phasingLinkedFullHash: null,
            phasingHashedSecret: null,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            feeATM: toSend.fee,
            controlMaxFees: toSend.maxFees,
            ...toSend
        };
        const res = await this.props.submitForm(mappedRequestBody, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveByBalance = async toSend => {
        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const object = {
            controlWhitelisted: toSend.phasingWhitelisted,
            controlMinBalanceModel: toSend.phasingMinBalanceModel,
            controlVotingModel: 1,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            secretPhrase: toSend.secretPhrase,
            feeATM: toSend.fee,
            controlQuorum: toSend.amount,
            controlMaxFees: toSend.maxFees,
        };
        const res = await this.props.submitForm(object, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveWithAsset = async toSend => {
        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const object = {
            controlQuorumATUf: toSend.assetQuantity,
            controlHolding: "",
            controlWhitelisted: 1,
            controlMinBalanceModel: 0,
            controlVotingModel: 0,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
            phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            feeATM: toSend.fee,
            controlMaxFees: toSend.maxFees,
            secretPhrase: toSend.secretPhrase,
        };
        const res = await this.props.submitForm(object, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    submitApproveWithCurrency = async toSend => {

        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const object = {
            controlWhitelisted: 1,
            controlMinBalanceModel: 0,
            controlVotingModel: 3,
            controlMinDuration: toSend.minDuration,
            controlMaxDuration: toSend.maxDuration,
            deadline: 1440,
            phased: false,
                    phasingHashedSecretAlgorithm: 2,
            publicKey: this.props.publicKey,
            feeATM: toSend.fee,
            controlMaxFees: toSend.maxFees,
            secretPhrase: toSend.secretPhrase,
            controlQuorum: toSend.currencyUnits,
        }

        const res = await this.props.submitForm(object, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Control has been setup!', null, 5000);
        }
    };

    setNoApprovalFormApi = api => {
        this.setState({
            noApproval: api
        })
    };

    setApproveByAccApi = api => {
        this.setState({
            approveByAcc: api
        });
    };

    setApproveByBalanceApi = api => {
        this.setState({
            approveByBalance: api
        })
    };

    setApproveWithAssetApi = api => {
        this.setState({
            approveWithAsset: api
        })
    };

    setApproveWithCurrencyApi = api => {
        this.setState({
            approveWithCurrency: api
        })
    };

    onFocus = (activeForm) => {
        this.setState({
            activeForm
        })
    }

    handleFormSubmit = (values) => {
        const {activeForm} = this.state;

        console.log()
        switch (activeForm) {
            case 0: 
                this.submitNoApproval(values);
                break;

            case 1: 
                this.submitApproveByAcc(values);
                break;

            case 2: 
                this.submitApproveByBalance(values);
                break;

            case 3: 
                this.submitApproveWithAsset(values);
                break;

            case 4:
                this.submitApproveWithCurrency(values);
                break;

            default : return; 
        }
    }

    render() {
        return (
            <ModalBody
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                modalTitle={'Mandatory Approval'}
                isAdvanced={true}
                modalSubTitle={'All subsequent transactions will be mandatory approved (phased) according to whatever is set below. Once set, this account control can only be removed with the approval of the accounts/stake holders set below.'}
                submitButtonName={'Submit'}
                isAdvancedWhite
            >
                <TabulationBody
                    className={'p-0 gray-form'}
                >
                    <TabContaier 
                        onFocus={() => this.onFocus(0)}
                        sectionName={<i className="zmdi zmdi-close-circle" />}
                    >
                        <NoApprovalBody
                            setApi={form => this.setNoApprovalFormApi(form)}
                        />
                    </TabContaier>
            
                    <TabContaier 
                        sectionName={<i className="zmdi zmdi-accounts" />}
                        onFocus={() => this.onFocus(1)}
                    >
                        <ApproveByAccountBody
                            setApi={form => this.setApproveByAccApi(form)}
                        />
                    </TabContaier>
            
                    <TabContaier 
                        sectionName={<i className="zmdi zmdi-money-box" />}
                        onFocus={() => this.onFocus(2)}
                    >
                        <ApproveByBalanceBody
                            setApi={form => this.setApproveByBalanceApi(form)}
                        />
                    </TabContaier>

                    <TabContaier 
                        sectionName={<i className="zmdi zmdi-chart" />}
                        onFocus={() => this.onFocus(3)}
                    >
                        <ApproveWithAssetBody
                            setApi={form => this.setApproveWithAssetApi(form)}
                        />
                    </TabContaier>

                    <TabContaier 
                        sectionName={<i className="zmdi zmdi-balance" />}
                        onFocus={() => this.onFocus(4)}
                    >
                        <ApproveWithCurrencyBody
                            setApi={form => this.setApproveWithCurrencyApi(form)}
                            handleFormSubmit={this.submitApproveWithCurrency}
                        />
                    </TabContaier>
                </TabulationBody>
            </ModalBody>
        )
    }
}

const mapStateToProps = state => ({
    publicKey: state.account.publicKey
});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MandatoryApprovalModal)