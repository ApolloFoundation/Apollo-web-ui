import React from 'react';
import OrderItem from '../order';
import CustomTable from '../../../components/tables/table';

const OffersToBuy = ({
  buyOrders, asset, page, onPaginate, itemsPerPage,
}) => (
  <div className="card">
    <div className="card-title">
      Offers to buy
      {asset.name}
    </div>
    <div className="card-body">
      <CustomTable
        header={[
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
        tableData={buyOrders}
        isPaginate
        itemsPerPage={itemsPerPage}
        page={page}
        previousHendler={() => onPaginate('buy', page - 1)}
        nextHendler={() => onPaginate('buy', page + 1)}
      />
    </div>
  </div>
);

export default OffersToBuy;
