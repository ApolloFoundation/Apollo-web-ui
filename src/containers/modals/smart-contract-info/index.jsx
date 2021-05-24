/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalBody from "../../components/modals/modal-body1";
import { getState } from "../../../actions/contracts";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const [smartContract, setSmartContract] = useState(null);
  const modalData = useSelector((state) => state.modals.modalData);

  const { address } = modalData;

  const getStateContract = useCallback(
    async (address) => {
      const state = await dispatch(getState(address));
      if (state) {
        setSmartContract(state);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    getStateContract(address);
  }, [address]);

  return (
    <ModalBody
      isDisableSecretPhrase={true}
      modalTitle="Contract Info"
      closeModal={closeModal}
    >
      {address && (
        <div className={"mb-2"}>
          <b>Address:</b> {address}
        </div>
      )}
      {smartContract && (
        <div>
          <b>Contract State:</b> {smartContract.state}
        </div>
      )}
    </ModalBody>
  );
}
