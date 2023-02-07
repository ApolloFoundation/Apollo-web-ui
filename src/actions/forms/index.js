/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { NotificationManager } from 'react-notifications';
import submitForm from 'helpers/forms/forms';
import { setModalProcessingTrueAction, setModalProcessingFalseAction } from 'actions/modals';
import store from 'store';

const { dispatch } = store;

export const calculateFeeAction = (requestParams, requestType) => dispatch(submitForm.submitForm(requestParams, requestType));

export const processForm = async (params, requestType, successMesage, successCallback, errorCallback) => {
  const { ...values } = params;
  dispatch(setModalProcessingTrueAction());

  const res = await dispatch(submitForm.submitForm(values, requestType));

  if (res) {
    if (res.errorCode) {
      dispatch(setModalProcessingFalseAction());

      if (errorCallback) {
        errorCallback(res);
      } else {
        NotificationManager.error(res.errorDescription, 'Error', 5000);
      }
    } else {
      dispatch(setModalProcessingFalseAction());

      if (successCallback) {
        successCallback(res);
      }
    }
  } else {
    dispatch(setModalProcessingFalseAction());

    if (errorCallback) {
      errorCallback(res);
    }
  }
  return res;
};
