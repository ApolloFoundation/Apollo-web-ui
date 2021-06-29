/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { formatTimestamp } from '../../../../helpers/util/time';
import { getTransactionAction } from '../../../../actions/transactions';

export default function TransferHistoryItem(props) {
  const dispatch = useDispatch();
  const [currency, setCurrency] = useState(null);

  const {
    assetTransfer, timestamp, code, recipientRS,
    decimals, quantityATU, recipient, sender, senderRS,
  } = props;

  useEffect(() => {
    dispatch(getTransactionAction({
      transaction: transfer,
    })).then(({ attachment }) => {
      console.log("🚀 ~ file: index1.jsx ~ line 25 ~ useEffect ~ attachment", attachment)
      setCurrency(attachment);
    })
  }, []);

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
