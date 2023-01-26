import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {getAskOrders } from "../../../../actions/marketplace";
import { useResetPaginationForTableLoader } from '../../../../hooks/useResetPaginationForTableLoader';
import { TableLoader } from '../../../components/TableLoader';
import OrderItem from '../order';

const OffersToSell = ({ asset, itemsPerPage }) => {
  const dispatch = useDispatch();
  const { isResetPagination, onResetPagination } = 
    useResetPaginationForTableLoader(asset.asset);

  const handleOrders = useCallback(async ({ firstIndex, lastIndex }) => {
    const sellOrders = await dispatch(getAskOrders({
        asset: asset.asset,
        firstIndex,
        lastIndex,
    }));
    if (sellOrders) {
        const assets = sellOrders.assets;
        const orders = sellOrders.orders;
        const result = assets.map((el, index) => ({...el, ...orders[index]}));
        return result;
    }
    return [];
  }, [dispatch, asset?.asset])

  return (
    <div className='col-xl-6 col-md-12 pr-0 pb-3'>
      <div className="card">
        <div className="card-title">{`Offers to sell ${asset.name}`}</div>
        <div className="card-body">
          <TableLoader
            headersList={[
              {
                name: 'Asset',
                alignRight: false,
              }, {
                name: 'Quantity',
                alignRight: false,
              }, {
                name: 'Price',
                alignRight: false,
              }, {
                name: 'Total',
                alignRight: false,
              },
            ]}
            className="p-0"
            emptyMessage="No sell offers for this asset."
            TableRowComponent={OrderItem}
            itemsPerPage={itemsPerPage}
            dataLoaderCallback={handleOrders}
            isResetPagination={isResetPagination}
            onResetPagination={onResetPagination}
          />
        </div>
      </div>
    </div>
  );
}

export default OffersToSell;
