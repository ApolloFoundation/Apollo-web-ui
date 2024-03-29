import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getSellOffersAction } from '../../../../../../actions/exchange-booth';
import CustomTable from '../../../../../components/tables/table1';
import OfferItem from '../../offer-item';

const itemsPerPage = 5;

export default function OffersToSellTable(props) {
  const dispatch = useDispatch();

  const { currencyInfo, setMinimumSellRate } = props;

  const { currency, code, decimals } = currencyInfo;

  const [sellOffers, setSellOffers] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: itemsPerPage,
  });

  const getSellOffers = useCallback(async currPagination => {
    let selectedCurrPagination = currPagination;

    if (!selectedCurrPagination) {
      selectedCurrPagination = pagination;
    }

    const newSellOffers = await dispatch(getSellOffersAction({
      currency,
      ...selectedCurrPagination,
    }));

    const { offers } = newSellOffers;

    const values = Math.min.apply(null, offers.map(el => el.rateATM));

    setMinimumSellRate('0');
    setPagination(newSellOffers);
    setSellOffers(offers);
    if (offers.length) {
      setMinimumSellRate(Number.isFinite(values) ? values : 0);
    }
  }, [currency, dispatch, pagination, setMinimumSellRate]);

  const onPaginate = useCallback(page => {
    const currPagination = {
      page,
      firstIndex: page * itemsPerPage - itemsPerPage,
      lastIndex: page * itemsPerPage,
    };

    getSellOffers(currPagination);
  }, [getSellOffers]);

  useEffect(() => {
    getSellOffers();
  }, [currencyInfo]);

  return (
    <div className="col-md-6 display-flex pr-0 mb-3">
      <div className="card h-auto">
        <div className="card-title">
          Offers to sell
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
            emptyMessage="No open sell offers. You cannot sell this currency now, but you can publish an exchange offer instead, and wait for others to fill it."
            TableRowComponent={OfferItem}
            tableData={sellOffers}
            passProps={{ decimals }}
            isPaginate
            itemsPerPage={itemsPerPage}
            page={pagination.page}
            previousHendler={() => onPaginate('sellOffers', pagination.page - 1)}
            nextHendler={() => onPaginate('sellOffers', pagination.page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
