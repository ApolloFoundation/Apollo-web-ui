import React, { useCallback  } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getBuyOrdersAction} from "actions/open-orders";
import { getAccountSelector } from "selectors";
import { TableLoader } from "containers/components/TableLoader";
import OrderItem from "../order";

export const OrderBuy = () => {
  const dispatch = useDispatch();
  const account = useSelector(getAccountSelector);

  const loadData = useCallback(async ({ firstIndex, lastIndex }) => {
    const { assets, orders } = await dispatch(getBuyOrdersAction({
        account,
        firstIndex,
        lastIndex,
    }));
    if (assets && orders) {
      const result = assets.map((el, index) => ({...el, ...orders[index]}));
      return result;
    }
    return [];
  }, [dispatch, account]);

  return (
    <TableLoader
      headersList={[
        {
            name: 'Asset',
            alignRight: false
        }, {
            name: 'Quantity',
            alignRight: false
        }, {
            name: 'Price',
            alignRight: false
        }, {
            name: 'Total',
            alignRight: false
        }, {
            name: 'Actions',
            alignRight: true
        }
      ]}
      emptyMessage="No assets found."
      TableRowComponent={OrderItem}
      dataLoaderCallback={loadData}
    />
  );
}
