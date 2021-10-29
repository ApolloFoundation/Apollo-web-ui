import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getBlockAction } from '../../../../../../actions/blocks';
import { getAccountExchangeAction } from '../../../../../../actions/exchange-booth';
import { setBodyModalParamsAction } from '../../../../../../modules/modals';
import CustomTable from '../../../../../components/tables/table1';
import ExchangeItem from './exchange-item';

const itemsPerPage = 5;

export default function ExchangeRequestsTable(props) {
  const dispatch = useDispatch();

  const { account, currencyInfo } = props;

  const { decimals, currency } = currencyInfo;

  const [exchangeRequest, setExchangeRequest] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: itemsPerPage,
  });

  const getAccountExchanges = useCallback(async currPagination => {
    let selectedCurrPagination = currPagination;

    if (!selectedCurrPagination) {
      selectedCurrPagination = pagination;
    }
    const accountExchanges = await dispatch(getAccountExchangeAction({
      currency,
      account,
      ...selectedCurrPagination,
    }));

    const { exchangeRequests } = accountExchanges;

    setExchangeRequest(exchangeRequests);
    setPagination(selectedCurrPagination);
  }, [account, currency, dispatch, pagination]);

  const getBlock = useCallback(async blockHeight => {
    const block = await dispatch(getBlockAction({ height: blockHeight }));

    if (block) {
      dispatch(setBodyModalParamsAction('INFO_BLOCK', block));
    }
  }, [dispatch]);

  const onPaginate = useCallback(page => {
    const currPagination = {
      page,
      firstIndex: page * itemsPerPage - itemsPerPage,
      lastIndex: page * itemsPerPage,
    };

    getAccountExchanges(currPagination);
  }, [getAccountExchanges]);

  useEffect(() => {
    getAccountExchanges();
  }, [currencyInfo]);

  return (
    <div className="col-md-12 pr-0 pb-3">
      <div className="card h-auto">
        <div className="card-title">
          Exchange requests
        </div>
        <div className="card-body h-auto">
          <CustomTable
            header={[
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
            tableData={exchangeRequest}
            passProps={{
              decimals,
              setBlockInfo: getBlock,
            }}
            isPaginate
            itemsPerPage={itemsPerPage}
            page={pagination.page}
            previousHendler={() => onPaginate('exchangeRequest', pagination.page - 1)}
            nextHendler={() => onPaginate('exchangeRequest', pagination.page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
