import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomTable from '../../../components/tables/table1';
import OfferItem from '../offer-item';

const itemsPerPage = 5;

export default function OffersToSellTable(props) {
  const dispatch = useDispatch();

  const { code, currencyInfo } = props;

  const [buyOffers, setBuyOffers] = useState(null);
  const [dataCurrency, setDataCurrency] = useState(null);
  const [minimumBuyRate, setMinimumBuyRate] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: itemsPerPage,
  });

  const getBuyOffers = useCallback(async (currency, currPagination) => {
    let selectedCurrPagination = currPagination;

    if (!selectedCurrPagination) {
      selectedCurrPagination = pagination;
    }
    const newBuyOffers = await dispatch(getBuyOffers({
      currency,
      ...selectedCurrPagination,
    }));
    const { offers } = newBuyOffers;

    const values = Math.min.apply(null, offers.map(el => el.rateATM));

    setBuyOffers(offers);
    setMinimumBuyRate('0');
    setPagination(selectedCurrPagination);
    if (offers.length) {
      setMinimumBuyRate(isFinite(values) ? values : 0);
    }
  }, [dispatch, pagination]);

  const onPaginate = useCallback(page => {
    const currPagination = {
      page,
      firstIndex: page * itemsPerPage - itemsPerPage,
      lastIndex: page * itemsPerPage,
    };

    getBuyOffers(dataCurrency.currency, currPagination);
  }, [dataCurrency.currency, getBuyOffers]);

  return (
    <div className="col-md-6 display-flex pr-0 mb-3">
      <div className="card h-auto">
        <div className="card-title">
          Offers to buy
          {' '}
          {code}
        </div>
        <div className="card-body h-auto">
          <CustomTable
            header={[
              {
                name: 'Account',
                alignRight: false,
              }, {
                name: 'Units',
                alignRight: true,
              }, {
                name: 'Limit',
                alignRight: true,
              }, {
                name: 'Rate',
                alignRight: true,
              },
            ]}
            className="p-0"
            emptyMessage="No open buy offers. You cannot sell this currency now, but you can publish an exchange offer instead, and wait for others to fill it."
            TableRowComponent={OfferItem}
            tableData={buyOffers}
            passProps={{ decimals: currencyInfo.decimals }}
            isPaginate
            itemsPerPage={itemsPerPage}
            page={pagination.page}
            previousHendler={() => onPaginate('buyOffers', pagination.page - 1)}
            nextHendler={() => onPaginate('buyOffers', pagination.page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
