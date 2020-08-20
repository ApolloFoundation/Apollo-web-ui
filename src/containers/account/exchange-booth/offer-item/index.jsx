/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { ONE_APL } from '../../../../constants';

export default function OfferItem(props) {
  const dispatch = useDispatch();

  const {
    decimals, accountRS, supply, limit, rateATM,
  } = props;

  return (
    <tr>
      <td onClick={dispatch(setBodyModalParamsAction('INFO_ACCOUNT', accountRS))}>
        <span className="blue-link-text">{accountRS}</span>
      </td>
      <td className="align-right">{supply / (10 ** decimals)}</td>
      <td className="align-right">{limit / (10 ** decimals)}</td>
      <td className="align-right">{((rateATM * (10 ** decimals)) / ONE_APL)}</td>
    </tr>
  );
}
