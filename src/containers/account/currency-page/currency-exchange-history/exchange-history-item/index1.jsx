/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { formatTimestamp } from '../../../../../helpers/util/time';
import { ONE_APL } from '../../../../../constants';

export default function TradeHistoryItem({ transfer }) {
  const dispatch = useDispatch();

  if (transfer) {
    return (
      <tr key={uuidv4()}>
        <td>{dispatch(formatTimestamp(transfer.timestamp))}</td>
        <td>
          <span
            className="blue-link-text"
            onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transfer.transaction))}
          >
            {transfer.transaction}
          </span>
        </td>
        <td>
          <span
            className="blue-link-text"
            onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transfer.offer))}
          >
            {transfer.offer}
          </span>
        </td>
        <td className="blue-link-text">
          <Link to={`/exchange-booth/${transfer.code || ''}`}>
            {transfer.code}
          </Link>
        </td>
        <td>
          <span
            className="blue-link-text"
            onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', transfer.seller))}
          >
            {transfer.sellerRS}
          </span>
        </td>
        <td>
          <span
            className="blue-link-text"
            onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', transfer.buyer))}
          >
            {transfer.buyerRS}
          </span>
        </td>
        <td className="align-right">
          {(transfer.units / (10 ** transfer.decimals)).toFixed(2)}
        </td>
        <td className="align-right">
          {parseFloat(transfer.rateATM).toLocaleString('en')}
        </td>
        <td className="align-right">
          {((transfer.units * transfer.rateATM) / ONE_APL).toLocaleString('ru', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    );
  }

  return (
    <tr key={uuidv4()} />
  );
}
