import React from 'react';
import {connect} from 'react-redux'
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../../../actions/blocks";
import {setBodyModalParamsAction} from "../../../../../modules/modals";
import './style.scss'

const infoAboutStep = {
    0: 'Step 1',
    1: 'Step 2',
    2: 'Step 3',
    3: 'Step 4',
}

class ContractStatusItem extends React.Component {

    getBlock = async (type, blockHeight) => {
        const requestParams = {
            height: blockHeight
        };

        const block = await this.props.getBlockAction(requestParams);

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        } else {
            NotificationManager.error('Error', 'Error', 5000);
        }
    }

    userType = sender => this.props.account.accountRS === sender

    renderCommonInfo = (sender, orderId, counterOrderId, recipient) => (
        <>
            <tr>
                <td>Your Order ID:</td>
                <td>{this.userType(sender) ? orderId : counterOrderId}</td>
            </tr>
            <tr>
                <td>Partner Order ID:</td>
                <td>{this.userType(sender) ? counterOrderId : orderId}</td>
            </tr>
            <tr>
                <td>Partner Account:</td>
                <td>{this.userType(sender) ? recipient : sender}</td>
            </tr>
        </>
    )

    renderContractHistoryItem = ({orderId, counterOrderId, recipient, contractStatus, sender, counterTransferTxId, height, id, transferTxId, encryptedSecret, secretHash}) => (
        <>
            <tr>
                <td>Contract Status:</td>
                <td>{infoAboutStep[contractStatus]}</td>
            </tr>
            <tr>
                <td>Height:</td>
                <td>
                    <a className={'blue-link-text'} onClick={() => this.getBlock('INFO_BLOCK', height)}>
                        {height}
                    </a>
                </td>
            </tr>
            <tr>
                <td >ID:</td>
                <td>{id}</td>
            </tr>
            {this.renderCommonInfo(sender, orderId, counterOrderId, recipient)}
            {contractStatus === 1 || contractStatus === 2 &&
            <> 
                <tr>
                    <td>Secret Hash:</td>
                    <td>{secretHash}</td>
                </tr>
                <tr>
                    <td>Encrypted Secret:</td>
                    <td>{encryptedSecret}</td>
                </tr>
                <tr>
                    <td>Counter Transfer Tx Id:</td>
                    <td>{counterTransferTxId}</td>
                </tr>
            </>}
            {contractStatus === 2 && <tr>
                <td>Transfer Tx Id:</td>
                <td>{transferTxId}</td>
            </tr>}
        </>
    )

    renderBasicContractInfo = ({contractStatus, orderId, counterOrderId, sender, recipient, counterTransferTxId}) => (
        <>
            <tr>
                <td>Contract Status:</td>
                <td>{infoAboutStep[contractStatus]}</td>
            </tr>
            {this.renderCommonInfo(sender, orderId, counterOrderId, recipient)}
            {(contractStatus === 1 || contractStatus === 2) &&
                <tr>
                    <td>Partner transfer
                        money transaction:</td>
                    <td>{counterTransferTxId}</td>
                </tr>}
        </>
    )

    render () {
        const {contracts, label, isContractHistory} = this.props
        return (
            <>
                {contracts && contracts.map((contract, key) => (
                    <div key={key} className={'contract-item'}>
                        <span className={'contract-item__label'}>
                            {label}
                        </span>
                        <div className="transaction-table details">
                            <table>
                                <tbody>
                                    {isContractHistory
                                    ? this.renderContractHistoryItem(contract)
                                    : this.renderBasicContractInfo(contract)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </>
        )
    }
}

const mapStateToProps = ({account}) => ({
    account: account,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getBlockAction: (data) => dispatch(getBlockAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractStatusItem)