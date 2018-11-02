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
        activeTab: 0,
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

    onSubmit = () => {
        switch (this.state.activeTab) {
            case 0:
                this.submitNoApproval(this.state.noApproval.getFormState().values);
                break;
            case 1:
                this.submitApproveByAcc(this.state.approveByAcc.getFormState().values);
                break;
            case 2:
                this.submitApproveByBalance(this.state.approveByBalance.getFormState().values);
                break;
            case 3:
                this.submitApproveWithAsset(this.state.approveWithAsset.getFormState().values);
                break;
            case 4:
                this.submitApproveWithCurrency(this.state.approveWithCurrency.getFormState().values);
                break;
        }
    };

    submitNoApproval = async toSend => {
        console.warn(toSend);
        if (!toSend.secretPhrase || toSend.secretPhrase.length === 0) {
            NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
            return;
        }

        const res = await this.props.submitForm(toSend, "setPhasingOnlyControl");
        if (res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            NotificationManager.success('Monitor has been started!', null, 5000);
            this.props.closeModal();
            setTimeout(() => {
                this.props.modalData()
            }, 1000);
        }
    };

    submitApproveByAcc = toSend => {
        console.warn(toSend);

    };

    submitApproveByBalance = toSend => {
        console.warn(toSend);

    };

    submitApproveWithAsset = toSend => {
        console.warn(toSend);

    };

    submitApproveWithCurrency = toSend => {
        console.warn(toSend);

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

    render() {
        return (
            <Modal
                closeModal={this.props.closeModal}
                title="Mandatory Approval Modal"
            >
                <Message/>
                <ModalTabs
                    tabs={tabs}
                    onTabSelected={this.tabSelected}
                    activeTab={this.state.activeTab}
                >
                    <Tab
                        active={this.state.activeTab === 0}
                    >
                        <NoApprovalBody
                            setApi={form => this.setNoApprovalFormApi(form)}
                        />
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 1}
                    >
                        <ApproveByAccountBody
                            setApi={form => this.setApproveByAccApi(form)}
                        />
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 2}
                    >
                        <ApproveByBalanceBody
                            setApi={form => this.setApproveByBalanceApi(form)}
                        />
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 3}
                    >
                        <ApproveWithAssetBody
                            setApi={form => this.setApproveWithAssetApi(form)}
                        />
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 4}
                    >
                        <ApproveWithCurrencyBody
                            setApi={form => this.setApproveWithCurrencyApi(form)}
                        />
                    </Tab>
                </ModalTabs>
                <ModalFooter>
                    <SubmitButton
                        submit={this.onSubmit}
                    />
                    <CancelButton
                        close={this.props.closeModal}
                    />
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    submitForm: (data, requestType) => dispatch(submitForm.submitForm(data, requestType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MandatoryApprovalModal)