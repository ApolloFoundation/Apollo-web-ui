import React from 'react';
import OrderItem from "../order";
import CustomTable from "../../../components/tables/table";

const OffersToSell = ({sellOrders, asset, page, onPaginate, itemsPerPage}) => (
    <div className={'card'}>
        <div className="card-title">Offers to sell {asset.name}</div>
        <div className="card-body">
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
                    }
                ]}
                className={'p-0'}
                emptyMessage={'No sell offers for this asset.'}
                TableRowComponent={OrderItem}
                tableData={sellOrders}
                isPaginate
                itemsPerPage={itemsPerPage}
                page={page}
                previousHendler={() => onPaginate('sell', page - 1)}
                nextHendler={() => onPaginate('sell', page + 1)}
            />
        </div>
    </div>
);

export default OffersToSell;
