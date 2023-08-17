import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from 'modules/modals';
import { setModalProcessingTrueAction, setModalProcessingFalseAction } from 'actions/modals';
import { sendCurrencyTransferOffline, checkIsVaultWallet } from 'helpers/transactions';
import { getAccountRsSelector, getPassPhraseSelector } from 'selectors';
import submitForm from 'helpers/forms/forms';

export const handleFormSubmit = ({decimals, ...values}) => async (dispatch, getState) => {
  const state = getState();
  const accountRS = getAccountRsSelector(state);
  const passPhrase = getPassPhraseSelector(state);

  const data = {
    ...values,
    units: values.units * (10 ** (decimals || 0)),
  };

  dispatch(setModalProcessingTrueAction());

  const isVaultWallet = checkIsVaultWallet(data.secretPhrase, accountRS);
  let res = null;

  try {
    res = isVaultWallet ? 
      await dispatch(submitForm.submitForm(data, 'transferCurrency')) : await sendCurrencyTransferOffline(data, accountRS, passPhrase);
  } catch (e) {
    dispatch(setModalProcessingFalseAction());
    NotificationManager.error(e.message, 'Error', 5000);
    return;
  }

  if (res && res.errorCode) {
    dispatch(setModalProcessingFalseAction())
    NotificationManager.error(res.errorDescription, 'Error', 5000);
  } else {
    dispatch(setModalProcessingFalseAction())
    dispatch(setBodyModalParamsAction());
    NotificationManager.success('Transfer currency request has been submitted!', null, 5000);
  }
};
