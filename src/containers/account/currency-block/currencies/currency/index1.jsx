/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { getCurrencyTypes } from '../../../../../modules/currencies';

export default function Currency(props) {
  const dispatch = useDispatch();
  const {
    currency, code, type, types, decimals,
    currentSupply, maxSupply, name,
  } = props;
  const currencyTypes = getCurrencyTypes(type);

  return (
    <tr>
      <td>
        <span
          className="blue-link-text"
          onClick={() => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', currency))}
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
            onClick={() => setBodyModalParamsAction('RESERVE_CURRENCY', props)}
            className={`btn btn-default ${types.includes('RESERVABLE') ? '' : 'disabled'}`}
          >
            Reserve
          </button>
        </div>
      </td>
    </tr>
  );
};
