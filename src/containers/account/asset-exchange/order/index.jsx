/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderInfoAction } from 'actions/open-orders';
import { getDecimalsSelector } from 'selectors';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

const OrderItem = ({ asset, quantityATU, decimals, priceATM }) => {
  const dispatch = useDispatch();
  const [orderInfo, setOrderInfo] = useState({});
  const currentCoinDecimals = useSelector(getDecimalsSelector);

  const getOrderInfo = useCallback(() => {
    dispatch(getOrderInfoAction(asset))
      .then(res => {
        setOrderInfo(res || {});
      });
  }, [dispatch, asset]);

  useEffect(() => {
    getOrderInfo();
  }, [getOrderInfo]);

  const base = useMemo(() => bigIntDecimalsDivision(quantityATU, decimals), [quantityATU, decimals]);
  const baseMultiply = useMemo(() => bigIntMultiply(quantityATU, priceATM),[quantityATU, priceATM]);
  const total = useMemo(() => bigIntDivision(baseMultiply, currentCoinDecimals), [baseMultiply, currentCoinDecimals])
  const price = useMemo(() => bigIntDivision(total, base), [base, total]);

  return (
    <tr>
      <td className="align-left blue-link-text">
        {orderInfo.name}
      </td>
      <td className="align-left">{bigIntFormat(base)}</td>
      <td>{bigIntFormat(price)}</td>
      <td>{bigIntFormat(total)}</td>
    </tr>
  );
}

export default OrderItem;
