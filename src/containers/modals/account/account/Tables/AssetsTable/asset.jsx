/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  getAskOrders as getAskOrdersAction,
  getBidOrders as getBidOrdersAction,
} from 'actions/marketplace';
import { setBodyModalParamsAction } from 'modules/modals';

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
        {(unconfirmedQuantityATU / Math.pow(10, decimals)).toLocaleString('en', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </td>
      <td>
        {(quantityATU / Math.pow(10, decimals)).toLocaleString('en', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </td>
      <td>
        {((parseInt(unconfirmedQuantityATU) / parseInt(quantityATU)) * 100).toFixed(2)}
        &nbsp;%
      </td>
      <td>
        {
          !!(state.lowestAskOrder / Math.pow(10, 8) * Math.pow(10, decimals))
          && (state.lowestAskOrder / Math.pow(10, 8) * Math.pow(10, decimals))
            .toLocaleString('en', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
        }
      </td>
      <td>
        {
          !!(state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals))
          && (state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals))
            .toLocaleString('en', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
        }
      </td>
      <td>
        {
          !!(state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals))
          && ((state.highestBidOrder / Math.pow(10, 8) * Math.pow(10, decimals))
              * (quantityATU / Math.pow(10, decimals))).toLocaleString('en', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        }
      </td>
    </tr>
  );
}

export default AssetItem;
