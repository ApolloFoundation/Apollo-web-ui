import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TableLoader } from '../../../../../components/TableLoader';
import { getAccountExchangeAction } from '../../../../../../actions/exchange-booth';
import ExchangeItem from './exchange-item';

export default function ExchangeRequestsTable({ account, currencyInfo }) {
  const dispatch = useDispatch();
  const { decimals, currency } = currencyInfo;

  const getAccountExchanges = useCallback(async ({ firstIndex, lastIndex }) => {
    const accountExchanges = await dispatch(getAccountExchangeAction({
      currency,
      account,
      firstIndex,
      lastIndex,
    }));

    return accountExchanges?.exchangeRequests ?? [];
  }, [account, currency, dispatch]);

  return (
    <div className="col-md-12 pr-0 pb-3">
      <div className="card h-auto">
        <div className="card-title">Exchange requests</div>
        <div className="card-body h-auto">
          <TableLoader
            headersList={[
              {
                name: 'Height',
                alignRight: false,
              }, {
                name: 'Type',
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
            emptyMessage="No exchange requests found."
            TableRowComponent={ExchangeItem}
            passProps={{
              decimals,
            }}
            dataLoaderCallback={getAccountExchanges}
            itemsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
}
