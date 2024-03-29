/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';

export default function TransferHistoryItem(props) {
  const dispatch = useDispatch();

  const {
    assetTransfer, timestamp, recipientRS,
    decimals, quantityATU, recipient, sender, senderRS,
  } = props;

  return (
    <tr key={assetTransfer}>
      <td className="blue-link-text">
        <span onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', assetTransfer))}>{assetTransfer}</span>
      </td>
      <td>
        {name}
        <a><span className="info" /></a>
      </td>
      <td className="">{dispatch(formatTimestamp(timestamp))}</td>
      <td className="align-right">
        {(quantityATU / (10 ** decimals)).toLocaleString('en', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </td>
      <td className="blue-link-text">
        <span onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', recipient))}>{recipientRS}</span>
      </td>
      <td className="blue-link-text">
        <span onClick={() => dispatch(setBodyModalParamsAction('INFO_ACCOUNT', sender))}>{senderRS}</span>
      </td>
    </tr>
  );
}
