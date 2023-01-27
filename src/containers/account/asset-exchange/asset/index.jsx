/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import crypto from '../../../../helpers/crypto/crypto';
import converters from '../../../../helpers/converters';
import { getDecimalsSelector } from '../../../../selectors';

export default function Asset(props) {
  const dispatch = useDispatch();

  const decimals = useSelector(getDecimalsSelector);

  const {
    entry, publicKey, privateKey, sharedKey,
  } = props;

  const [entryData, setEntryData] = useState(entry);

  useEffect(() => {
    if (entry.encryptedLedgerEntry) {
      const options = {
        publicKey: converters.hexStringToByteArray(publicKey),
        privateKey: converters.hexStringToByteArray(privateKey),
      };

      options.sharedKey = sharedKey;

      let decrypted = crypto.decryptDataStreamAPL(entry.encryptedLedgerEntry, options);
      decrypted = decrypted.message;

      decrypted = converters.hexStringToStringAPL(decrypted);
      decrypted = decrypted.slice(0, decrypted.lastIndexOf('}') + 1);
      decrypted = JSON.parse(decrypted);

      setEntryData(decrypted);
    }
  }, []);

  return (
    <>
      {!entryData.encryptedLedgerEntry
        ? (
          <tr>
            <td>
              <span
                className="blue-link-text"
                onClick={dispatch(setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', entryData.ledgerId))}
              >
                {entryData.timestamp}
              </span>
            </td>
            <td>
              {entryData.eventType}
              <a>
                <span className="info" />
              </a>
            </td>
            <td className="align-right">
              -
              {entryData.change / decimals}
            </td>
            <td>{(entryData.balance / decimals).toFixed(2)}</td>
            <td>
              <a></a>
            </td>
            <td className="align-right">
              <a></a>
            </td>
            <td className="align-right">
              <a></a>
            </td>
          </tr>
        ) : (
          <tr>encrypted</tr>
        )}
    </>
  );
}
