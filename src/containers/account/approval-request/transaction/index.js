/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";
import {getTransactionAction} from "../../../../actions/transactions";

class Transaction extends React.Component {
    getTransactionInfo = async transaction => {
        return await this.props.getTransactionAction({
            transaction,
            random: Math.random()
        })
    };

    render () {
        const {
          transaction, timestamp, formatTimestamp, amountATM, feeATM,
          senderRS, attachment, height, confirmations, setBodyModalParamsAction, decimals,
        } = this.props;

        return (
            <tr>
                <td className="blue-link-text">
                    <a onClick={async () => setBodyModalParamsAction('INFO_TRANSACTION', await this.getTransactionInfo(transaction))}>
                        {formatTimestamp(timestamp)}
                    </a>
                </td>
                <td className="align-right">Ordinary Payment</td>
                <td className="align-right">{amountATM / decimals}</td>
                <td>{feeATM / decimals}</td>
                <td className="blue-link-text align-right"><a onClick={setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', senderRS)}>{senderRS}</a></td>
                <td>{attachment.phasingHolding} / {attachment.phasingQuorum}</td>
                <td>{height}</td>
                <td>{confirmations}</td>
                <td className="">
                    <div className="btn-box inline">
                        <button
                            type={'button'}
                            onClick={() => {
                                setBodyModalParamsAction("APPROVE_TRANSACTION", {transaction: this.props});
                            }}
                            className="btn btn-default"
                        >
                            Approve
                        </button>
                    </div>
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
});

const mapStateToProps = state => ({
   account: state.account.account,
   decimals: state.account.decimals,
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
