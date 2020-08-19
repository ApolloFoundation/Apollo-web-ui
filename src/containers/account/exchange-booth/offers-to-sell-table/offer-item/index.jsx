/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import { ONE_APL } from '../../../../../constants';

export default function OfferItem(props) {
  const dispatch = useDispatch();

  const { decimals, ...offer } = props;

  return (
    <tr>
      <td onClick={dispatch(setBodyModalParamsAction('INFO_ACCOUNT', offer.accountRS))}>
        <span className="blue-link-text">{offer.accountRS}</span>
      </td>
      <td className="align-right">{offer.supply / (10 ** decimals)}</td>
      <td className="align-right">{offer.limit / (10 ** decimals)}</td>
      <td className="align-right">{(offer.rateATM * (10 ** decimals) / ONE_APL)}</td>
    </tr>
  );
}
