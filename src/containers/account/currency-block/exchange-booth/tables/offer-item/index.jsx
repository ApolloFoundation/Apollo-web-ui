/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../../modules/modals';

export default function OfferItem(props) {
  const dispatch = useDispatch();

  const { decimals: currentCoinDecimals } = useSelector(state => state.account);

  const {
    decimals, accountRS, supply, limit, rateATM,
  } = props;

  const handleClick = useCallback(() => {
    dispatch(setBodyModalParamsAction('INFO_ACCOUNT', accountRS))
  }, [dispatch, accountRS]);

  return (
    <tr>
      <td onClick={handleClick}>
        <span className="blue-link-text">{accountRS}</span>
      </td>
      <td className="align-right">{supply / (10 ** decimals)}</td>
      <td className="align-right">{limit / (10 ** decimals)}</td>
      <td className="align-right">{((rateATM * (10 ** decimals)) / currentCoinDecimals)}</td>
    </tr>
  );
}
