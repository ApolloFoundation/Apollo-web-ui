import React from 'react';
import { useDispatch } from "react-redux";
import { setBodyModalParamsAction } from 'modules/modals';

export const CurrencyButtonMenu = ({ currencyInfo, isGoBack, goBack }) => {
  const dispatch = useDispatch();

  const handleOfferCurrencyModal = () => dispatch(setBodyModalParamsAction('OFFER_CURRENCY', currencyInfo));

  const handleTransferCurrency = () => dispatch(setBodyModalParamsAction('TRANSFER_CURRENCY', currencyInfo));

  return (
    <>
      <button
        type="button"
        onClick={handleOfferCurrencyModal}
        className="btn btn-green btn-sm"
      >
        Offer
      </button>
      <button
        type="button"
        onClick={handleTransferCurrency}
        style={{ marginLeft: 15 }}
        className="btn btn-green btn-sm"
      >
        Transfer
      </button>
        {(window.innerWidth < 767 && isGoBack) && (
          <button
            type="button"
            className="btn btn-default btn-sm ml-3"
            onClick={goBack}
          >
            <i className="zmdi zmdi-long-arrow-left" />
            &nbsp;&nbsp;
            Back to list
          </button>
        )}
    </>
  );
}