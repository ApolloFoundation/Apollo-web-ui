import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTransactionAction } from '../../../../../actions/transactions';
import { getExchangesAction } from '../../../../../actions/exchange-booth';
import { setBodyModalParamsAction } from '../../../../../modules/modals';
import CustomTable from '../../../../components/tables/table1';
import ExecutedItem from './executed-item';

const itemsPerPage = 5;

export default function ExecutedExcahngeTable(props) {
  const dispatch = useDispatch();

  const { currencyInfo } = props;

  const { decimals, currency } = currencyInfo;

  const [executedExchanges, setExecutedExchanges] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: itemsPerPage,
  });

  const getTransaction = useCallback(async requestParams => {
    const transaction = await dispatch(getTransactionAction(requestParams));

    if (transaction) {
      dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction));
    }
  }, [dispatch]);

  const getExchanges = useCallback(async currPagination => {
    let selectedCurrPagination = currPagination;

    if (!selectedCurrPagination) {
      selectedCurrPagination = pagination;
    }
    const dataExcahnge = await dispatch(getExchangesAction({
      currency,
      ...selectedCurrPagination,
    }));

    const { exchanges } = dataExcahnge;

    setExecutedExchanges(exchanges);
    setPagination(selectedCurrPagination);
  }, [currency, dispatch, pagination]);

  const onPaginate = useCallback(page => {
    const currPagination = {
      page,
      firstIndex: page * itemsPerPage - itemsPerPage,
      lastIndex: page * itemsPerPage,
    };

    getExchanges(currPagination);
  }, [getExchanges]);

  useEffect(() => {
    getExchanges();
  }, [currencyInfo]);

  return (
    <div className="col-md-12 pr-0 pb-3">
      <div className="card h-auto">
        <div className="card-title">
          Executed exchanges
        </div>
        <div className="card-body h-auto">
          <CustomTable
            header={[
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
            tableData={executedExchanges}
            passProps={{
              decimals,
              setTransactionInfo: getTransaction,
            }}
            isPaginate
            itemsPerPage={itemsPerPage}
            page={pagination.page}
            previousHendler={() => onPaginate('executedExchanges', pagination.page - 1)}
            nextHendler={() => onPaginate('executedExchanges', pagination.page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
