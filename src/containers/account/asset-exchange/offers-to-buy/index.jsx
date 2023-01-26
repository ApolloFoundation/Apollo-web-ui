import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getBidOrders } from "../../../../actions/marketplace";
import { TableLoader } from '../../../components/TableLoader';
import { useResetPaginationForTableLoader } from '../../../../hooks/useResetPaginationForTableLoader';
import OrderItem from '../order';

const OffersToBuy = ({ asset, itemsPerPage }) => {
  const dispatch = useDispatch();
  const { isResetPagination, onResetPagination } = 
    useResetPaginationForTableLoader(asset.asset);

  const handleOrders =  useCallback(async ({ firstIndex, lastIndex }) => {
    const buyOrders = await dispatch(getBidOrders({
        asset: asset.asset,
        firstIndex,
        lastIndex,
    }));
    if (buyOrders) {
      const assets = buyOrders.assets;
      const orders = buyOrders.orders;
      const result = assets.map((el, index) => ({...el, ...orders[index]}));
      return result;
    }
    return [];
  }, [dispatch, asset?.asset]);

  return (
    <div className='col-xl-6 col-md-12 pr-0 pb-3'>
      <div className="card">
        <div className="card-title">{`Offers to buy ${asset.name}`}</div>
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
            emptyMessage="No buy offers for this asset."
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

export default OffersToBuy;
