/** ****************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { NotificationManager } from "react-notifications";
import { handleFetch, POST, GET } from "../../helpers/fetch";

export function exportTestContract(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/validate`, POST, requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        NotificationManager.success("Contract has been validated", null, 10000);
        return res;
      })
      .catch((err) => console.log(err));
}

export function exportContractSubmit(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/publish`, POST, requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        NotificationManager.success(
          "Contract has been published!",
          null,
          10000
        );
        return res;
      })
      .catch((err) => console.log(err));
}

export function testSmcMethod(requestParams) {
  return () =>
    handleFetch(
      `/rest/v2/smc/method/validate`,
      POST,
      requestParams,
      false,
      true
    )
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        NotificationManager.success("Contract has been validated", null, 10000);
        return res;
      })
      .catch((err) => console.log(err));
}

export function callSmcMethod(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/method/call`, POST, requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        NotificationManager.success(
          "Contract request has been submitted!",
          null,
          10000
        );
        return res;
      })
      .catch((err) => console.log(err));
}

export function publishSmcTransaction(requestParams) {
  return () =>
    handleFetch(`/rest/v2/transaction`, POST, requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        NotificationManager.success(
          "Publishing request has been submitted",
          null,
          10000
        );
        return res;
      })
      .catch((err) => console.log(err));
}
export function exportReadMethod(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/method/read`, POST, requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}
export function getContracts(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc`, GET, requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
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
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getState(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/${requestParams}/state`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getSmcSpecification(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/${requestParams}/spec`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getSmcSourceInfo(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/${requestParams}`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getTokenList(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/asr?type=${requestParams}`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getTokensForm(requestParams) {
  return () =>
    handleFetch(` /rest/v2/smc/asr/${requestParams}/init/`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getContractCode(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/asr/${requestParams}/src`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getSmcEvent(id, requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/${id}/event`, POST, requestParams, false, true)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}

export function getContractExtraInfo(requestParams) {
  return () =>
    handleFetch(`/rest/v2/state/tx/${requestParams}`)
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return null;
        }
        return res;
      })
      .catch((err) => console.log(err));
}
