/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { setBodyModalParamsAction } from 'modules/modals';
import { getCurrencyTypes } from 'modules/currencies';

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

  const handleInfoTransactionModal = () =>
    dispatch(setBodyModalParamsAction('INFO_TRANSACTION', currency));

  const handleOfferCurrencyModal = () =>
    dispatch(setBodyModalParamsAction('OFFER_CURRENCY', { code, currency }));

  const handleClaimCurrencyModal = () =>
    dispatch(setBodyModalParamsAction('CLAIM_CURRENCY', currency));

  return (
    <tr>
      <td>
        <span className="blue-link-text" onClick={handleInfoTransactionModal}>
          {code}
        </span>
      </td>
      <td>{name}</td>
      <td className="" dangerouslySetInnerHTML={{ __html: currencyTypes }} />
      <td className="align-right">{unconfirmedUnits / (10 ** decimals)}</td>
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
            onClick={handleOfferCurrencyModal}
            className="btn btn-default"
          >
            Offer
          </button>
          <button
            type="button"
            onClick={handleClaimCurrencyModal}
            className={classNames('btn btn-default', { 'disabled': isClaimable })}
          >
            Claim
          </button>
        </div>
      </td>
    </tr>
  );
}
