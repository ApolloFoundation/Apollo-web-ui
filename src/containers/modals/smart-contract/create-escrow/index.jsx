/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTokenList } from "../../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../../modules/modals";

const CreateEscrow = () => {
  const dispatch = useDispatch();

  const getStateTokenList = useCallback(async () => {
    const { modules } = await dispatch(getTokenList("escrow"));
    if (modules) {
      dispatch(
        setBodyModalParamsAction("SMC_APROVE_TOKEN", {
          token: modules[0],
          params: {},
          type: "escrow",
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    getStateTokenList();
  }, []);

  return <></>;
}
export default CreateEscrow;
