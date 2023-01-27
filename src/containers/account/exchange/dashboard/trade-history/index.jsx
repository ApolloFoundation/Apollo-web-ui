import React, {
  useEffect, useCallback, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { formatDivision } from '../../../../../helpers/format';
import { ONE_GWEI } from '../../../../../constants/constants';
import { BlockUpdater } from '../../../../block-subscriber';
import { getMyTradeHistory } from '../../../../../actions/wallet';
import ArrowUp from '../../../../../assets/arrow-up.png';
import ArrowDown from '../../../../../assets/arrow-down.png';
import CustomTable from '../../../../components/tables/table1';
import { getExchangeInfoSelector } from '../../../../../selectors';

const itemsPerPage = 15;

export default function TradeHistoryExchange({ currentCurrency, ticker }) {
  const dispatch = useDispatch();

  const { myTradeHistory } = useSelector(getExchangeInfoSelector, shallowEqual);

  const [currentPaggination, setCurrentPaggination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: itemsPerPage,
  });

  const [dataCurrency, setDataСurrency] = useState(null);

  const listener = useCallback(() => {
    dispatch(getMyTradeHistory(dataCurrency.currency, currentPaggination));
  }, [currentPaggination, dataCurrency, dispatch]);

  const onPaginate = useCallback(async (page = 1) => {
    const pagination = {
      page,
      firstIndex: page * itemsPerPage - itemsPerPage,
      lastIndex: page * itemsPerPage,
    };

    await dispatch(getMyTradeHistory(dataCurrency.currency, pagination));
    setCurrentPaggination(pagination);
  }, [dataCurrency, dispatch]);

  useEffect(() => {
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, [listener]);

  useEffect(() => {
    if (currentCurrency !== dataCurrency) {
      const pagination = {
        page: 1,
        firstIndex: 0,
        lastIndex: itemsPerPage,
      };
      dispatch(getMyTradeHistory(currentCurrency.currency, pagination));
      setDataСurrency(currentCurrency);
    }
  }, [currentCurrency, dataCurrency, dispatch]);

  const { page } = currentPaggination;

  return (
    <div className="wrap-card-square">
      <div className="card card-light triangle-bg card-square">
        <div className="card-body">
          <div className="tabs-wrap tabs-primary mb-3">
            <Link to="/trade-history-exchange" className="tab-item w-auto active">
              Trade history
            </Link>
          </div>
          {myTradeHistory[currentCurrency.currency]
            ? (
              <CustomTable
                header={[
                  {
                    name: 'Price',
                    alignRight: false,
                  }, {
                    name: `Amount ${ticker}`,
                    alignRight: false,
                  }, {
                    name: 'Total',
                    alignRight: false,
                  },
                ]}
                className="table-sm"
                tableData={myTradeHistory[currentCurrency.currency]}
                emptyMessage="No trade history found."
                TableRowComponent={tableProps => {
                  const pairRate = formatDivision(tableProps.pairRate, ONE_GWEI, 9);
                  const offerAmount = formatDivision(tableProps.offerAmount, ONE_GWEI, 9);
                  const total = formatDivision(tableProps.pairRate * tableProps.offerAmount, 10 ** 18, 9);
                  return (
                    <tr>
                      <td>
                        <img
                          className="arrow"
                          src={tableProps.type ? ArrowDown : ArrowUp}
                          alt="Apollo"
                        />
                        {pairRate}
                      </td>
                      <td>{offerAmount}</td>
                      <td>{total}</td>
                    </tr>
                  );
                }}
                isPaginate
                page={page}
                previousHendler={() => onPaginate(page - 1)}
                nextHendler={() => onPaginate(page + 1)}
                itemsPerPage={itemsPerPage}
              />
            )
            : (
              <div className="align-items-center loader-box">
                <div className="ball-pulse">
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
