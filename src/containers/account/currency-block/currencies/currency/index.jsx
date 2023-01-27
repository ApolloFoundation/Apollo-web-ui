/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { setBodyModalParamsAction } from 'modules/modals';
import { getCurrencyTypes } from 'modules/currencies';
import { getActualBlockSelector } from 'selectors';

export default function Currency(props) {
  const dispatch = useDispatch();
  const actualBlock = useSelector(getActualBlockSelector);

  const {
    currency, code, type, types, decimals,
    currentSupply, maxSupply, name, issuanceHeight,
  } = props;
  const currencyTypes = getCurrencyTypes(type);

  const isReserveDisable = actualBlock >= issuanceHeight;
  const isDisable = !types.includes('RESERVABLE') || !actualBlock || types.includes('RESERVABLE') && isReserveDisable;

  const handleInfoTransactionModal = () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', currency));

  const handleReserveCurrency = () => dispatch(setBodyModalParamsAction('RESERVE_CURRENCY', props));

  return (
    <tr>
      <td>
        <span
          className="blue-link-text"
          onClick={handleInfoTransactionModal}
        >
          {code}
        </span>
      </td>
      <td>{name}</td>
      <td className="" dangerouslySetInnerHTML={{ __html: currencyTypes }} />
      <td className="align-right">{currentSupply / 10 ** decimals}</td>
      <td className="align-right">{maxSupply / 10 ** decimals}</td>
      <td className="align-right">
        <div className="btn-box inline">
          <Link to={`/exchange-booth/${code}`} className="btn btn-default">Exchange</Link>
          <button
            type="button"
            onClick={handleReserveCurrency}
            className={classNames('btn btn-default', {
              'disabled': isDisable,
            })}
          >
            Reserve
          </button>
        </div>
      </td>
    </tr>
  );
}
