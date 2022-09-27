/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { getCurrencyTypes } from '../../../../../modules/currencies';
import { bigIntDecimalsDivision } from '../../../../../helpers/util/utils';

export default function MyCurrencytemItem(props) {
  const dispatch = useDispatch();
  const {
    code, type, name, unconfirmedUnits,
    decimals, currency, accountRS
  } = props;

  const currencyTypes = getCurrencyTypes(type);
  const isClaimable = currencyTypes.includes('Claimable');

  const handleTransfer = useCallback(() => {
    dispatch(setBodyModalParamsAction(
      'TRANSFER_CURRENCY', 
      { 
        code,
        currency,
        decimals,
        recipient: accountRS,
      })
    );
  }, [dispatch, code, currency, accountRS]);

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', currency))}>
          {code}
        </span>
      </td>
      <td>{name}</td>
      <td className="" dangerouslySetInnerHTML={{ __html: currencyTypes }} />
      <td className="align-right">
        {bigIntDecimalsDivision(unconfirmedUnits, decimals)}
      </td>
      <td className="align-right">
        <div className="btn-box inline">
          <Link to={`/exchange-booth/${code}`} className="btn btn-default">Exchange</Link>
          <button
            type="button"
            onClick={handleTransfer}
            style={{ marginLeft: 15 }}
            className="btn btn-default"
          >
            Transfer
          </button>
          <button
            type="button"
            onClick={() => dispatch(setBodyModalParamsAction('OFFER_CURRENCY', { code, currency }))}
            className="btn btn-default"
          >
            Offer
          </button>
          <button
            type="button"
            onClick={() => dispatch(setBodyModalParamsAction('CLAIM_CURRENCY', currency))}
            className={`btn btn-default ${isClaimable ? '' : 'disabled'}`}
          >
            Claim
          </button>
        </div>
      </td>
    </tr>
  );
}
