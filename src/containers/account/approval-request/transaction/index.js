import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";
import CryptoJS from 'crypto-js'
import {getTransactionAction} from "../../../../actions/transactions";

class Transaction extends React.Component {
    constructor(props) {
        super(props);
    }

    getTransactionInfo = async transaction => {
        return await this.props.getTransactionAction({
            transaction,
            random: Math.random()
        })
    };

    render () {
        const {transaction} = this.props;
        return (
            <tr key={uuid}>
                <td className="blue-link-text"><a onClick={async () => this.props.setBodyModalParamsAction('INFO_TRANSACTION', await this.getTransactionInfo(transaction.transaction))}>{this.props.formatTimestamp(transaction.timestamp)}</a></td>
                <td className="align-left">Ordinary Payment</td>
                <td className="align-right">{transaction.amountATM / 100000000}</td>
                <td>{transaction.feeATM / 100000000}</td>
                <td className="blue-link-text"><a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', transaction.senderRS)}>{transaction.senderRS}</a></td>
                <td>{transaction.attachment.phasingHolding} / {transaction.attachment.phasingQuorum}</td>
                <td>{transaction.height}</td>
                <td>{transaction.confirmations}</td>
                <td className="blue-link-text"><a onClick={() => {
                    this.props.setBodyModalParamsAction("APPROVE_TRANSACTION", {transaction});
                }}>Approve</a></td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
});

const mapStateToProps = state => ({
   account: state.account.account
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);