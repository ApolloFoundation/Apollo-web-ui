/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalBody from "../../../components/modals/modal-body1";
import { getState } from "../../../../actions/contracts";

export default function ({ closeModal }) {
  const dispatch = useDispatch();
  const [smartContract, setSmartContract] = useState(null);
  const { address } = useSelector((state) => state.modals.modalData);

  useEffect(() => {
    getStateContract(address);
  }, [address]);

  const getStateContract = useCallback(
    async (address) => {
      const stateInfo = await dispatch(getState(address));
      if (stateInfo) {
        const formatedData = JSON.parse(stateInfo.state);
        setSmartContract(formatedData);
      }
    },
    [dispatch]
  );

  return (
    <ModalBody
      isDisableSecretPhrase={true}
      modalTitle="Contract Info"
      closeModal={closeModal}
    >
      {smartContract && (
        <div className="transaction-table no-min-height transparent">
          <div className="transaction-table-body transparent full-info">
            <table>
              <tbody>
                <tr>
                  <td>Address:</td>
                  <td>{address}</td>
                </tr>
                <tr>
                  <td>Value :</td>
                  <td>{smartContract.value}</td>
                </tr>
                <tr>
                  <td>Vendor:</td>
                  <td>{smartContract.vendor}</td>
                </tr>

                <tr>
                  <td>Paid :</td>
                  <td>{smartContract.paid.toString()}</td>
                </tr>
                <tr>
                  <td>Accepted :</td>
                  <td>{smartContract.accepted.toString()}</td>
                </tr>
                <tr>
                  <td>Customer :</td>
                  <td>{smartContract.customer.hex}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ModalBody>
  );
}
