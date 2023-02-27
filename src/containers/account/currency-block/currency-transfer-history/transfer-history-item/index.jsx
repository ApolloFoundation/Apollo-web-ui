/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from 'modules/modals';
import { getTransactionAction } from 'actions/transactions';
import { Tooltip } from 'containers/components/tooltip';
import RedIcon from 'assets/red-triangle.svg'
import { useFormatTimestamp } from 'hooks/useFormatTimestamp';
import styles from './index.module.scss';
import { bigIntDecimalsDivision, bigIntToString } from 'helpers/util/bigNumberWrappers';

export default function TransferHistoryItem(props) {
  const dispatch = useDispatch();
  const [currency, setCurrency] = useState(null);
  const handleTime = useFormatTimestamp();

  const {
    transfer, code, timestamp, senderRS, sender,
    units, decimals = 0, recipient, recipientRS,
  } = props;

  useEffect(() => {
    dispatch(getTransactionAction({
      transaction: transfer,
    })).then(({ attachment }) => {
      setCurrency(attachment);
    })
  }, [dispatch, transfer]);

  const name = code ? (
    <Link to={"/exchange-booth/" + code}>{code}</Link>
    ) : (
      <>
        <span className={styles.emptyCurrencyCode}>{currency && currency.currency}</span>
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
  );

  const handleAccountInfoModal = (data) => () =>
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', data));

  const handleTransactionInfo = () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transfer));

  console.log(bigIntDecimalsDivision(units, decimals).toFormat(), bigIntDecimalsDivision(units, decimals).toString())

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={handleTransactionInfo}>
          {transfer}
        </span>
      </td>
      <td className="blue-link-text">
        {name}
      </td>
      <td className="">{handleTime(timestamp)}</td>
      <td className="align-right">{bigIntToString(bigIntDecimalsDivision(units, decimals))} {unitsTooltip}</td>
      <td>
        <span className="blue-link-text" onClick={handleAccountInfoModal(recipient)}>
          {recipientRS}
        </span>
      </td>
      <td>
        <span className="blue-link-text" onClick={handleAccountInfoModal(sender)}>
          {senderRS}
        </span>
      </td>
    </tr>
  );
}
