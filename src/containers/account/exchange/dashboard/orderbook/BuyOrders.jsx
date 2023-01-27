import React, {
  useEffect, useCallback, useState,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getBuyOpenOffers } from 'actions/wallet';
import { setSelectedOrderInfo } from 'modules/modals';
import { formatDivision } from 'helpers/format';
import CustomTable from 'containers/components/tables/table1';
import { getExchangeInfoSelector } from 'selectors';
import { ONE_GWEI } from 'constants/constants';

export default function BuyOrders({ currentCurrency, buyOrders, ticker }) {
  const dispatch = useDispatch();

  const [currency, setCurrency] = useState(null);

  const { buyOrdersPagination: ordersPagination } = useSelector(getExchangeInfoSelector, shallowEqual);

  const onPaginate = useCallback(page => {
    const pagination = {
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    };

    dispatch(getBuyOpenOffers(null, pagination));
  }, [dispatch]);

  useEffect(() => {
    if (currentCurrency !== currency) {
      const pagination = {
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
      };
      dispatch(getBuyOpenOffers(null, pagination));
      setCurrency(currentCurrency);
    }
  }, [currency, currentCurrency, dispatch]);

  return (
    <CustomTable
      header={[
        {
          name: `Price ${currentCurrency.currency.toUpperCase()}`,
          alignRight: false,
        }, {
          name: `Amount ${ticker}`,
          alignRight: true,
        }, {
          name: `Total ${currentCurrency.currency.toUpperCase()}`,
          alignRight: true,
        },
      ]}
      className="table-sm orderbook"
      defaultRowCount={15}
      tableData={buyOrders}
      emptyMessage="No buy orders found."
      TableRowComponent={tableProps => {
        const pairRate = formatDivision(tableProps.pairRate, ONE_GWEI, 9);
        const offerAmount = formatDivision(tableProps.offerAmount, ONE_GWEI, 9);
        const total = tableProps.pairRate * tableProps.offerAmount;
        const totalFormat = formatDivision(total, 10 ** 18, 9);
        return (
          <tr
            onClick={() => dispatch(setSelectedOrderInfo({
              pairRate: tableProps.pairRate, offerAmount: tableProps.offerAmount, total, type: 'SELL',
            }))}
            className="success"
          >
            <td className="text-success">{pairRate}</td>
            <td className="align-right">{offerAmount}</td>
            <td className="align-right">{totalFormat}</td>
          </tr>
        );
      }}
      isPaginate
      page={ordersPagination.page}
      previousHendler={() => onPaginate(ordersPagination.page - 1)}
      nextHendler={() => onPaginate(ordersPagination.page + 1)}
      itemsPerPage={15}
    />
  );
}
