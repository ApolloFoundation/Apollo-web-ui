import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction, IS_MODAL_PROCESSING } from 'modules/modals';
import submitForm from 'helpers/forms/forms';

export const handleFormSubmit = ({decimals, ...values}) => async dispatch => {
  const data = {
    ...values,
    units: values.units * (10 ** (decimals || 0)),
  };

  dispatch({
    type: IS_MODAL_PROCESSING,
    payload: true,
  });

  const res = await dispatch(submitForm.submitForm(data, 'transferCurrency'));
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
    dispatch(setBodyModalParamsAction());
    NotificationManager.success('Transfer currency request has been submitted!', null, 5000);
  }
};
