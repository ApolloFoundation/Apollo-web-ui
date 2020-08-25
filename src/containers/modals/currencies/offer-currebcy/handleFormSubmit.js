import { NotificationManager } from 'react-notifications';
import {
  setBodyModalParamsAction,
  setModalData,
  saveSendModalState,
  IS_MODAL_PROCESSING,
} from '../../../../modules/modals';
import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = values => async dispatch => {
  const { decimals, currency } = values;

  values = {
    ...values,
    currency,
    initialBuySupply: values.initialBuySupply * Math.pow(10, decimals),
    totalBuyLimit: values.totalBuyLimit * Math.pow(10, decimals),
    totalSellLimit: values.totalSellLimit * Math.pow(10, decimals),
    initialSellSupply: values.initialSellSupply * Math.pow(10, decimals),
    sellRateATM: values.sellRateATM * Math.pow(10, 8 - decimals),
    buyRateATM: values.buyRateATM * Math.pow(10, 8 - decimals),
  };

  dispatch({
    type: IS_MODAL_PROCESSING,
    payload: true,
  });

  const res = await dispatch(submitForm.submitForm(values, 'publishExchangeOffer'));
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
