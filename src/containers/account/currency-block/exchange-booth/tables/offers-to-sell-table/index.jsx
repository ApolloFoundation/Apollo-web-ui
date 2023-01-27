import React, {useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TableLoader } from '../../../../../components/TableLoader';
import { getSellOffersAction } from '../../../../../../actions/exchange-booth';
import OfferItem from '../../offer-item';

const itemsPerPage = 5;

export default function OffersToSellTable({ currencyInfo, setMinimumSellRate }) {
  const dispatch = useDispatch();
  const { currency, code, decimals } = currencyInfo;

  const getSellOffers = useCallback(async ({ firstIndex, lastIndex }) => {
    const newSellOffers = await dispatch(getSellOffersAction({
      currency,
      firstIndex,
      lastIndex,
    }));

    if (!newSellOffers || !newSellOffers.offers) return [];

    const { offers } = newSellOffers;

    const values = Math.min(...offers.map(el => el.rateATM));

    const minRate = offers.length && Number.isFinite(values) ? values : '0'; 
    setMinimumSellRate(minRate);
    return offers;
  }, [currency, dispatch, setMinimumSellRate]);

  return (
    <div className="col-md-6 display-flex pr-0 mb-3">
      <div className="card h-auto">
        <div className="card-title">
          Offers to sell
          {' '}
          {code}
        </div>
        <div className="card-body h-auto">
          <TableLoader
            headersList={[
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
            passProps={{ decimals }}
            itemsPerPage={itemsPerPage}
            dataLoaderCallback={getSellOffers}
          />
        </div>
      </div>
    </div>
  );
}
