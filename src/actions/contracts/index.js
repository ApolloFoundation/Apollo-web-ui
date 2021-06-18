/** ****************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { NotificationManager } from "react-notifications";
import { handleFetch, POST } from "../../helpers/fetch";

export function exportTestContract(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/validate`, "POST", requestParams, false, true)
      .then((res) => {
        if (!res.errorCode) {
          NotificationManager.success(
            "Validation request has been validated!",
            null,
            10000
          );
        } else {
          NotificationManager.error(res.errorDescription, "Error", 10000);
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function exportContractSubmit(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/publish`, "POST", requestParams, false, true)
      .then((res) => {
        if (!res.errorCode) {
          NotificationManager.success(
            "Contract request has been submited!",
            null,
            10000
          );
        } else {
          NotificationManager.error(res.errorDescription, "Error", 10000);
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function exportTestExperationMessage(requestParams) {
  return () =>
    handleFetch(
      `/rest/v2/smc/method/validate`,
      POST,
      requestParams,
      false,
      true
    )
      .then((res) => {
        if (!res.errorCode) {
          NotificationManager.success(
            "Experation Message has been validated!",
            null,
            10000
          );
        } else {
          NotificationManager.error(res.errorDescription, "Error", 10000);
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function exportConfirmationOnBoard(requestParams) {
  return () =>
    handleFetch(`/rest/v2/transaction`, "POST", requestParams, false, true)
      .then((res) => {
        if (!res.errorCode) {
          NotificationManager.success(
            "Contract request has been published!",
            null,
            10000
          );
        } else {
          NotificationManager.error(res.errorDescription, "Error", 10000);
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function exportExperationMessageSubmit(requestParams) {
  return () =>
    handleFetch(`/rest/v2/method/call`, "POST", requestParams, false, true)
      .then((res) => {
        if (!res.errorCode) {
          NotificationManager.success(
            "Contract request has been submitted!",
            null,
            10000
          );
        } else {
          NotificationManager.error(res.errorDescription, "Error", 10000);
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getContracts(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc`, "GET", requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getMyContracts(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/owner/${requestParams}`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getState(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/state/${requestParams}`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}
