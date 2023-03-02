import React, {
  useEffect, useState, useCallback,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getSellOpenOffers } from 'actions/wallet';
import { setSelectedOrderInfo } from 'modules/modals';
import CustomTable from 'containers/components/tables/table1';
import { getExchangeInfoSelector } from 'selectors';
import { ONE_GWEI } from 'constants/constants';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';
import { numberToLocaleString } from 'helpers/format';

export default function SellOrders({ currentCurrency, sellOrders, ticker }) {
  const dispatch = useDispatch();

  const { sellOrdersPagination: ordersPagination } = useSelector(getExchangeInfoSelector, shallowEqual);

  const [currency, setCurrency] = useState(null);

  const onPaginate = useCallback(page => {
    const pagination = {
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    };

    dispatch(getSellOpenOffers(null, pagination));
  }, [dispatch]);

  useEffect(() => {
    if (currentCurrency !== currency) {
      const pagination = {
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
      };
      dispatch(getSellOpenOffers(null, pagination));
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
      tableData={sellOrders}
      emptyMessage="No sell orders found."
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
          <tr onClick={() => dispatch(setSelectedOrderInfo({
            pairRate: tableProps.pairRate, offerAmount: tableProps.offerAmount, total, type: 'BUY',
          }))}
          >
            <td className="text-danger">{pairRate}</td>
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
