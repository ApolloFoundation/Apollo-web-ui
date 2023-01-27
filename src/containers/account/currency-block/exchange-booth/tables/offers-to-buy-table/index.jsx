import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TableLoader } from 'containers/components/TableLoader';
import { getBuyOffersAction } from 'actions/exchange-booth';
import OfferItem from '../../offer-item';

const itemsPerPage = 5;

export default function OffersToBuyTable({ currencyInfo, setMinimumBuyRate }) {
  const dispatch = useDispatch();
  const { currency, code, decimals } = currencyInfo;

  const getBuyOffers = useCallback(async ({ firstIndex, lastIndex }) => {
    const newBuyOffers = await dispatch(getBuyOffersAction({
      currency,
      firstIndex,
      lastIndex,
    }));

    if (!newBuyOffers || !newBuyOffers.offers) return [];

    const { offers } = newBuyOffers;

    const values = Math.min(...offers.map(el => el.rateATM));

    const minRate = offers.length && Number.isFinite(values) ? values : '0';
    setMinimumBuyRate(minRate);

    return offers;
  }, [currency, dispatch, setMinimumBuyRate]);

  return (
    <div className="col-md-6 display-flex pr-0 mb-3">
      <div className="card h-auto">
        <div className="card-title">
          Offers to buy
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
            emptyMessage="No open buy offers. You cannot sell this currency now, but you can publish an exchange offer instead, and wait for others to fill it."
            TableRowComponent={OfferItem}
            passProps={{ decimals }}
            itemsPerPage={itemsPerPage}
            dataLoaderCallback={getBuyOffers}
          />
        </div>
      </div>
    </div>
  );
}
