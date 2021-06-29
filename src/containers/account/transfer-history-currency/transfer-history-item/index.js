/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import {getTransactionAction, getTransactionsID} from '../../../../actions/transactions';
import { Tooltip } from '../../../components/tooltip';
import RedIcon from '../../../../assets/red-triangle.svg'
import styles from './index.module.scss';

class TransferHistoryItem extends React.Component {
    state = {
        currency: null,
    }

    componentDidMount() {
        const { getTransactionAction, code, transfer } = this.props;
        if (!code) {
            getTransactionAction({
                transaction: transfer,
            }).then(({ attachment }) => {
                this.setState({ currency: attachment });
            })
        }
    }

    render () {
        const {setBodyModalParamsAction, transfer, code, timestamp, formatTimestamp, units, decimals = 0, recipient, recipientRS, sender, senderRS} = this.props;

        const name = code ? (
            <Link to={"/exchange-booth/" + code}>{code}</Link>
        ) : (
            <>
                <span className={styles.emptyCurrencyCode}>{this.state.currency && this.state.currency.currency}</span>
                <Tooltip icon={RedIcon}>
                    <div>
                        This currency has been removed
                    </div> 
                </Tooltip>
            </>
        );

        const unitsTooltip = !decimals && !code && (
            <Tooltip icon={RedIcon}>
                <div>
                    This currency has been removed. Units is without decimals convertation.
                </div> 
            </Tooltip>
        )

        return (
            <tr key={uuid()}>
                <td className="blue-link-text">
                    <a 
                        onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', transfer)}
                    >
                        {transfer}
                    </a>
                </td>
                <td className="blue-link-text">
                   {name}
                </td>
                <td className="">{formatTimestamp(timestamp)}</td>
                <td className="align-right" >{units / Math.pow(10, decimals)} {unitsTooltip}</td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', recipient)}>{recipientRS}</a>
                </td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', sender)}>{senderRS}</a>
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = {
    setBodyModalParamsAction,
    formatTimestamp,
    getTransactionAction,
    getTransactionsID
};

export default connect(null, mapDispatchToProps)(TransferHistoryItem);