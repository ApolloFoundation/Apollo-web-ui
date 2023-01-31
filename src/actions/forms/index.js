/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { NotificationManager } from 'react-notifications';
import { IS_MODAL_PROCESSING } from '../../modules/modals';
import submitForm from '../../helpers/forms/forms';
import store from '../../store';

const { dispatch } = store;

export const calculateFeeAction = (requestParams, requestType) => dispatch(submitForm.submitForm(requestParams, requestType));

export const processForm = async (params, requestType, successMesage, successCallback, errorCallback) => {
  const { ...values } = params;
  dispatch({
    type: IS_MODAL_PROCESSING,
    payload: true,
  });

  const res = await dispatch(submitForm.submitForm(values, requestType));

  if (res) {
    if (res.hasOwnProperty('errorCode')) {
      dispatch({
        type: IS_MODAL_PROCESSING,
        payload: false,
      });

      if (errorCallback) {
        errorCallback(res);
      } else {
        NotificationManager.error(res.errorDescription, 'Error', 5000);
      }
    } else {
      dispatch({
        type: IS_MODAL_PROCESSING,
        payload: false,
      });

      if (successCallback) {
        successCallback(res);
      }
    }
  } else {
    dispatch({
      type: IS_MODAL_PROCESSING,
      payload: false,
    });

    if (errorCallback) {
      errorCallback(res);
    }
  }
  return res;
};
