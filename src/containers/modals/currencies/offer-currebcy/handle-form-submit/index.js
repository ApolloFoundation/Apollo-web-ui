import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction, IS_MODAL_PROCESSING } from 'modules/modals';
import submitForm from 'helpers/forms/forms';

export const handleFormSubmit = values => async dispatch => {
  const { decimals, currency } = values;

  const data = {
    ...values,
    currency,
    initialBuySupply: values.initialBuySupply * (10 ** decimals),
    totalBuyLimit: values.totalBuyLimit * (10 ** decimals),
    totalSellLimit: values.totalSellLimit * (10 ** decimals),
    initialSellSupply: values.initialSellSupply * (10 ** decimals),
    sellRateATM: values.sellRateATM * (10 ** (8 - decimals)),
    buyRateATM: values.buyRateATM * (10 ** (8 - decimals)),
  };

  dispatch({
    type: IS_MODAL_PROCESSING,
    payload: true,
  });

  const res = await dispatch(submitForm.submitForm(data, 'publishExchangeOffer'));
  if (res && res.errorCode) {
    dispatch({
      type: IS_MODAL_PROCESSING,
      payload: false,
    });

    NotificationManager.error(res.errorDescription, 'Error', 5000);
  } else {
    dispatch({
      type: IS_MODAL_PROCESSING,
      payload: false,
    });
    dispatch(setBodyModalParamsAction(null, {}));
    NotificationManager.success('Transfer asset request has been submitted!', null, 5000);
  }
};
