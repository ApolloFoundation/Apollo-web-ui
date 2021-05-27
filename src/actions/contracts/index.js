/** ****************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { NotificationManager } from "react-notifications";
import { handleFetch, POST } from "../../helpers/fetch";

export function exportTestContract(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/publish/test`, POST, requestParams, false, true)
      .then((res) => {
        if (!res.errorCode) {
          NotificationManager.success(
            "Validation request has been submitted!",
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
    handleFetch(`/rest/v2/transaction`, POST, requestParams, false, true)
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

export function exportTestExperationMessage(requestParams) {
  return () =>
    handleFetch(`/rest/v2/smc/call/test`, POST, requestParams, false, true)
      .then((res) => {
        if (!res.errorCode) {
          NotificationManager.success(
            "Experation Message has been submitted!",
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
  const { firstIndex, lastIndex, searchQuery } = requestParams;
  let searchParams = "";
  if (searchQuery) {
    searchParams = Object.keys(searchQuery)
      .map((key) => `${key}=${searchQuery[key]}&`)
      .join("");
  }
  return () =>
    handleFetch(
      `/rest/v2/smc?${searchParams}firstIndex=${firstIndex}&lastIndex=${lastIndex}`
    )
      .then((res) => {
        if (res.errorCode) {
          NotificationManager.error(res.errorDescription, "Error", 10000);
          return {
            contracts: [],
          };
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
