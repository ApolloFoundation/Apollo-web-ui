import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getExchangesAction } from 'actions/exchange-booth';
import { TableLoader } from 'containers/components/TableLoader';
import ExecutedItem from './executed-item';

export default function ExecutedExcahngeTable({ currencyInfo }) {
  const dispatch = useDispatch();
  const { decimals, currency } = currencyInfo;

  const getExchanges = useCallback(async ({ firstIndex, lastIndex }) => {
    const dataExcahnge = await dispatch(getExchangesAction({
      currency,
      firstIndex,
      lastIndex,
    }));
    return dataExcahnge?.exchanges ?? [];
  }, [currency, dispatch]);

  return (
    <div className="col-md-12 pr-0 pb-3">
      <div className="card h-auto">
        <div className="card-title">Executed exchanges</div>
        <div className="card-body h-auto">
          <TableLoader
            headersList={[
              {
                name: 'Date',
                alignRight: false,
              }, {
                name: 'Seller',
                alignRight: false,
              }, {
                name: 'Buyer',
                alignRight: false,
              }, {
                name: 'Units',
                alignRight: true,
              }, {
                name: 'Rate',
                alignRight: true,
              }, {
                name: 'Total',
                alignRight: true,
              },
            ]}
            className="p-0"
            emptyMessage="No executed exchanges found."
            TableRowComponent={ExecutedItem}
            passProps={{
              decimals,
            }}
            dataLoaderCallback={getExchanges}
            itemsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
}
