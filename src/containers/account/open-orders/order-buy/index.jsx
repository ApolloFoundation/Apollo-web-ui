import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getBuyOrdersAction} from "../../../../actions/open-orders";
import OrderItem from "../order";
import {BlockUpdater} from "../../../block-subscriber";
import ContentLoader from '../../../components/content-loader'
import CustomTable from "../../../components/tables/table";
import { getAccountSelector } from "../../../../selectors";

export const OrderBuy = () => {
  const dispatch = useDispatch();
  const account = useSelector(getAccountSelector);

  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const handlePagination = useCallback((page) => () => {
    setPagination({
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15
    });
  }, []);

  const loadData = useCallback(async () => {
    const { assets, orders } = await dispatch(getBuyOrdersAction({
        account,
        firstIndex: pagination.firstIndex,
        lastIndex: pagination.lastIndex,
    }));
    if (assets && orders) {
      const result = assets.map((el, index) => ({...el, ...orders[index]}));

      setData(result);
    }
  }, [dispatch, account, pagination.firstIndex, pagination.lastIndex])

  useEffect(() => {
    loadData();
    BlockUpdater.on("data", loadData);
    return () => {
      BlockUpdater.removeListener("data", loadData);
    }
  }, [loadData]);

  if (!data) return (<ContentLoader noPaddingOnTheSides />);

  return (
    <CustomTable
      header={[
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
      className='p-0'
      emptyMessage='No assets found.'
      TableRowComponent={OrderItem}
      tableData={data}
      isPaginate
      page={pagination.page}
      previousHendler={handlePagination(pagination.page - 1)}
      nextHendler={handlePagination(pagination.page + 1)}
      itemsPerPage={15}
    />
  );
}