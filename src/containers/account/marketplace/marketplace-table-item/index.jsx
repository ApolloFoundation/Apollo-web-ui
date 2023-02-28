/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDecimalsSelector, getTickerSelector } from 'selectors';
import { numberToLocaleString } from 'helpers/format';
import { setBodyModalParamsAction } from 'modules/modals';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const MarketplaceTableItem = props => {
  const dispatch = useDispatch();
  const decimals = useSelector(getDecimalsSelector);
  const ticker = useSelector(getTickerSelector);

  const handleInfoTransation = () => dispatch(setBodyModalParamsAction('INFO_TRANSACTION', props.goods));

  const handleChangePrice = () => dispatch(setBodyModalParamsAction('CHANGE_PRICE', props.goods));

  const handleChangeQuantity = () => dispatch(setBodyModalParamsAction('CHANGE_QUANTITY', props.goods));

  const handleDeleteGoods = () => dispatch(setBodyModalParamsAction('DELETE_GOODS', props.goods));

  return (
    <tr>
      <td className="blue-link-text">
        <a onClick={handleInfoTransation}>
          {props.name}
        </a>
      </td>
      <td className="align-right">
        <a>{props.quantity}</a>
      </td>
      <td className="align-right">
        {numberToLocaleString(bigIntFormat(bigIntDivision(props.priceATM, decimals)))}
        {' '}
        {ticker}
      </td>
      <td className="align-right">
        <div className="btn-box inline">
          <button
            type="button"
            onClick={handleChangePrice}
            className="btn btn-default"
          >
            Change Price
          </button>
          <button
            type="button"
            onClick={handleChangeQuantity}
            className="btn btn-default"
          >
            Change QTY
          </button>
          <button
            type="button"
            onClick={handleDeleteGoods}
            className="btn btn-default"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default MarketplaceTableItem;
