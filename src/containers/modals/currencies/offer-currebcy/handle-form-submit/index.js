import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from 'modules/modals';
import { setModalProcessingTrueAction, setModalProcessingFalseAction } from 'actions/modals';
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

  dispatch(setModalProcessingTrueAction);

  const res = await dispatch(submitForm.submitForm(data, 'publishExchangeOffer'));
  if (res && res.errorCode) {
    dispatch(setModalProcessingFalseAction());
    NotificationManager.error(res.errorDescription, 'Error', 5000);
  } else {
    dispatch(setModalProcessingFalseAction());
    dispatch(setBodyModalParamsAction(null, {}));
    NotificationManager.success('Transfer asset request has been submitted!', null, 5000);
  }
};
