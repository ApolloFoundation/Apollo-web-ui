/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { getTransactionAction } from '../../../../actions/transactions';
import { ONE_APL } from '../../../../constants';

export default function Transaction(props) {
  const dispatch = useDispatch();

  const {
    transaction, timestamp, amountATM, confirmations,
    feeATM, senderRS, attachment, height,
  } = props;

  const getTransactionInfo = useCallback(async transaction => await dispatch(getTransactionAction({
    transaction,
    random: Math.random(),
  })), [dispatch]);

  return (
    <tr key={uuidv4()}>
      <td className="blue-link-text">
        <a onClick={async () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', await this.getTransactionInfo(transaction)))}>
          {dispatch(formatTimestamp(timestamp))}
        </a>
      </td>
      <td className="align-right">Ordinary Payment</td>
      <td className="align-right">{amountATM / ONE_APL}</td>
      <td>{feeATM / ONE_APL}</td>
      <td className="blue-link-text align-right">
        <a onClick={dispatch(setBodyModalParamsAction('INFO_ACCOUNT', senderRS))}>
          {senderRS}
        </a>
      </td>
      <td>
        {attachment.phasingHolding}
        {' '}
        /
        {' '}
        {attachment.phasingQuorum}
      </td>
      <td>{height}</td>
      <td>{confirmations}</td>
      <td className="">
        <div className="btn-box inline">
          <button
            type="button"
            onClick={() => {
              setBodyModalParamsAction('APPROVE_TRANSACTION', { transaction: this.props });
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
