import React, {
  useEffect, useCallback, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { numberToLocaleString } from 'helpers/format';
import { BlockUpdater } from 'containers/block-subscriber';
import { getMyTradeHistory } from 'actions/wallet';
import ArrowUp from 'assets/arrow-up.png';
import ArrowDown from 'assets/arrow-down.png';
import CustomTable from 'containers/components/tables/table1';
import { getExchangeInfoSelector } from 'selectors';
import { ONE_GWEI } from 'constants/constants';
import { BallPulse } from 'containers/components/BallPulse';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

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
                  const pairRate = numberToLocaleString(bigIntFormat(bigIntDivision(tableProps.pairRate, ONE_GWEI)), {
                    minimumFractionDigits: 9,
                    maximumFractionDigits: 9,
                  })
                  const offerAmount = numberToLocaleString(bigIntFormat(bigIntDivision(tableProps.offerAmount, ONE_GWEI)), {
                    minimumFractionDigits: 9,
                    maximumFractionDigits: 9,
                  })
                  const total = bigIntMultiply(tableProps.pairRate, tableProps.offerAmount);
                  const totalFormat = numberToLocaleString(bigIntFormat(bigIntDecimalsDivision(total, 18)), {
                    minimumFractionDigits: 9,
                    maximumFractionDigits: 9,
                  });
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
                      <td>{totalFormat}</td>
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
                <BallPulse />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
