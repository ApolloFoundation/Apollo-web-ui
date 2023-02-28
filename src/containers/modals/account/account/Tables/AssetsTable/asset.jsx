/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { numberToLocaleString } from 'helpers/format';
import {
  getAskOrders as getAskOrdersAction,
  getBidOrders as getBidOrdersAction,
} from 'actions/marketplace';
import { setBodyModalParamsAction } from 'modules/modals';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply, checkIsValidBignumber } from 'helpers/util/bigNumberWrappers';

const AssetItem = ({ asset, decimals, name, unconfirmedQuantityATU, quantityATU }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({});

  const getAskOrders = useCallback(async () => {
    const askOrders = await dispatch(getAskOrdersAction(asset));

    if (askOrders && askOrders.orders) {
      let orders = Math.min(...askOrders.orders.map(el => el.priceATM));

      orders = isFinite(orders) ? orders : null;

      setState(prevState => ({ ...prevState, lowestAskOrder: orders }));
    }
  }, [asset, dispatch]);

  const getBidOrders = useCallback(async () => {
    const bidOrders = await dispatch(getBidOrdersAction(asset));

    if (bidOrders && bidOrders.orders) {
      let orders = Math.max(...bidOrders.orders.map(el => el.priceATM));

      orders = isFinite(orders) ? orders : null;

      setState(prevState => ({ ...prevState,  highestBidOrder: orders }));
    }
  }, [asset, dispatch]);

  useEffect(() => {
    getAskOrders();
    getBidOrders();
  }, [getBidOrders, getAskOrders]);

  const gotToAsset = () => {
    // for closing current modal
    dispatch(setBodyModalParamsAction());
    history.push(`/asset-exchange/${asset}`)
  };

  const lowest = useMemo(
    () =>  state.lowestAskOrder ? bigIntMultiply(bigIntDecimalsDivision(state.lowestAskOrder, 8), Math.pow(10, decimals)) : null,
    [decimals, state.lowestAskOrder]
  );
  const highest = useMemo(
      () =>  state.highestBidOrder ? bigIntMultiply(bigIntDecimalsDivision(state.highestBidOrder, 8), Math.pow(10, decimals)) : null,  
      [decimals, state.highestBidOrder]
  );
  const valInCoin = useMemo(
      () => highest ? bigIntMultiply(highest, bigIntDecimalsDivision(quantityATU, decimals)) : null,
      [decimals, quantityATU, highest]
  );

  return (
    <tr>
      <td className="blue-link-text">
        <span
          className="cursor-pointer blue-link-text"
          onClick={gotToAsset}
        >
          {name}
        </span>
      </td>
      <td>
        {numberToLocaleString(bigIntFormat(bigIntDecimalsDivision(unconfirmedQuantityATU, decimals)), {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </td>
      <td>
        {numberToLocaleString(bigIntFormat(bigIntDecimalsDivision(quantityATU, decimals)), {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </td>
      <td>
        {numberToLocaleString(bigIntFormat(bigIntMultiply(bigIntDivision(unconfirmedQuantityATU, quantityATU), 100)), {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        &nbsp;%
      </td>
      <td>
        {
          checkIsValidBignumber(lowest)
          && numberToLocaleString(lowest, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        }
      </td>
      <td>
        {
          checkIsValidBignumber(highest)
          && numberToLocaleString(highest, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        }
      </td>
      <td>
        {
          checkIsValidBignumber(highest)
          && numberToLocaleString(valInCoin, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        }
      </td>
    </tr>
  );
}

export default AssetItem;
