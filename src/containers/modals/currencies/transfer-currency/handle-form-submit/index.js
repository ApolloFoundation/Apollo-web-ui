import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from 'modules/modals';
import { setModalProcessingTrueAction, setModalProcessingFalseAction } from 'actions/modals';
import { sendCurrencyTransferOffline } from 'helpers/transactions';

export const handleFormSubmit = ({decimals, ...values}) => async dispatch => {
  const data = {
    ...values,
    units: values.units * (10 ** (decimals || 0)),
  };

  dispatch(setModalProcessingTrueAction())

  const res = await sendCurrencyTransferOffline(data);

  if (res && res.errorCode) {
    dispatch(setModalProcessingFalseAction())
    NotificationManager.error(res.errorDescription, 'Error', 5000);
  } else {
    dispatch(setModalProcessingFalseAction())
    dispatch(setBodyModalParamsAction());
    NotificationManager.success('Transfer currency request has been submitted!', null, 5000);
  }
};
