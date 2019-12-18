import React from 'react';
import normalizeDeadline from '../../../../../helpers/normalizeTime';
import './style.scss'

const ContractStatusItem = ({contract, label, isShowTime, account: {accountRS, timestamp}}) => {
    const infoAboutStep = {
        0: 'Step 1',
        1: 'Step 2',
        2: 'Step 3',
        3: 'Step 4',
    }

    const userType = sender => accountRS === sender

    return (
        <>
            {contract && contract.map(({orderId, counterOrderId, recipient, deadlineToReply, contractStatus, sender, counterTransferTxId}) => (
                <div className={'contract-item'}>
                    <span className={'contract-item__label'}>
                        {label || normalizeDeadline(deadlineToReply, timestamp)}
                    </span>
                    <div className="transaction-table details">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Contract Status:</td>
                                    <td>{infoAboutStep[contractStatus]}</td>
                                </tr>
                                <tr>
                                    <td>Your Order ID:</td>
                                    <td>{userType(sender) ? orderId : counterOrderId}</td>
                                </tr>
                                <tr>
                                    <td>Partner Order ID:</td>
                                    <td>{userType(sender) ? counterOrderId : orderId}</td>
                                </tr>
                                <tr>
                                    <td>Partner Account:</td>
                                    <td>{userType(sender) ? recipient : sender}</td>
                                </tr>
                                {/* {!isShowTime && 
                                    <tr>
                                        <td>Max waiting time:</td>
                                        <td>{timestamp && normalizeDeadline(deadlineToReply, timestamp)}</td>
                                    </tr>} */}
                                {(contractStatus === 1 || contractStatus === 2) &&
                                    <tr>
                                        <td>Partner transfer
                                            money transaction:</td>
                                        <td>{counterTransferTxId}</td>
                                    </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ContractStatusItem