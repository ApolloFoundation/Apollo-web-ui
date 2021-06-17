/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { formatTimestamp } from '../../../../../helpers/util/time';

export default function TransferHistoryItem(props) {
  const dispatch = useDispatch();

  const {
    transfer, code, timestamp, senderRS, sender,
    units, decimals = 0, recipient, recipientRS,
  } = props;

  return (
    <tr key={uuidv4()}>
      <td>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transfer))}
        >
          {transfer}
        </span>
      </td>
      <td className="blue-link-text">
        <Link to={`/exchange-booth/${code}`}>{code}</Link>
      </td>
      <td className="">{formatTimestamp(timestamp)}</td>
      <td className="align-right">{units / (10 ** decimals)}</td>
      <td>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', recipient))}
        >
          {recipientRS}
        </span>
      </td>
      <td>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', sender))}
        >
          {senderRS}
        </span>
      </td>
    </tr>
  );
}
