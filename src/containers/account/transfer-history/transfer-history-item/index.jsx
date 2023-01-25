/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { numberToLocaleString } from 'helpers/format';

export default function TransferHistoryItem(props) {
  const dispatch = useDispatch();

  const {
    assetTransfer, timestamp, recipientRS, name,
    decimals, quantityATU, recipient, sender, senderRS,
  } = props;

  const handleInfoTransactionModal = () =>
    dispatch(setBodyModalParamsAction('INFO_TRANSACTION', assetTransfer));

  const handleInfoAccountModal = (account) => () =>
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', account))

  return (
    <tr key={assetTransfer}>
      <td className="blue-link-text">
        <a onClick={handleInfoTransactionModal}>{assetTransfer}</a>
      </td>
      <td>
        {name}
        <a><span className="info" /></a>
      </td>
      <td className="">{dispatch(formatTimestamp(timestamp))}</td>
      <td className="align-right">
        {numberToLocaleString((quantityATU / (10 ** decimals)), {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </td>
      <td className="blue-link-text">
        <a onClick={handleInfoAccountModal(recipient)}>{recipientRS}</a>
      </td>
      <td className="blue-link-text">
        <a onClick={handleInfoAccountModal(sender)}>{senderRS}</a>
      </td>
    </tr>
  );
}
