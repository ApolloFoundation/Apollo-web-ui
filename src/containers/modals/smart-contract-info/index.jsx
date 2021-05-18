/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalBody from "../../components/modals/modal-body1";
import { getState } from "../../../actions/contracts";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.modals.modalData);
  const [smartContract, setSmartContract] = useState(null);

  const { address } = formData;

  useEffect(() => {
    dispatch(getState(address)).then((res) => setSmartContract(res));
  }, [dispatch]);

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
