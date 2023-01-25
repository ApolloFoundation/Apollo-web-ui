/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { formatTimestamp } from '../../../../../helpers/util/time';
import { numberToLocaleString } from '../../../../../helpers/format';

export default function TradeHistoryItem({ transfer, decimals }) {
  const dispatch = useDispatch();

  if (transfer) {
    return (
      <tr>
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
          {numberToLocaleString(parseFloat(transfer.rateATM))}
        </td>
        <td className="align-right">
          {numberToLocaleString(((transfer.units * transfer.rateATM) / decimals), {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    );
  }

  return (
    <tr />
  );
}
