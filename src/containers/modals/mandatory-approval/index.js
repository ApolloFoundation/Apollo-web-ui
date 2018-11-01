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

//TODO: extract to constants
const tabs = [
    "No approval",
    "Approve by account",
    "Approve by balance",
    "Approve with asset",
    "Approve with currency",
];

export default class MandatoryApprovalModal extends React.Component {

    state = {
        activeTab: 0,
    };

    tabSelected = tabIndex => {
        this.setState({
            activeTab: tabIndex
        })
    };

    onSubmit = () => {

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
                        <NoApprovalBody/>
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 1}
                    >
                        <ApproveByAccountBody/>
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 2}
                    >
                        <ApproveByBalanceBody/>
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 3}
                    >
                        <ApproveWithAssetBody/>
                    </Tab>
                    <Tab
                        active={this.state.activeTab === 4}
                    >
                        <ApproveWithCurrencyBody/>
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

