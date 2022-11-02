/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { getModalDataSelector } from '../../../../selectors';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import ModalBody from '../../../components/modals/modal-body1';
import ReserveCurrencyForm from './form';

export default function ReserveCurrency(props) {
  const dispatch = useDispatch();

  const { nameModal, closeModal, processForm } = props;

  const modalData = useSelector(getModalDataSelector);

  const [reserve, setReserve] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const handleFormSubmit = useCallback(async values => {
    if (!isPending) {
      setIsPending(true);

      if (!values.secretPhrase || values.secretPhrase.length === 0) {
        NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
        setIsPending(false);
        return;
      }

      const toSend = {
        currency: modalData.currency,
        decimals: modalData.decimals,
        amountPerUnitATM: Number(reserve),
        deadline: 1440,
        phased: false,
        phasingHashedSecretAlgorithm: 2,
        secretPhrase: values.secretPhrase,
        feeATM: values.feeATM,
      };

      await processForm(toSend, 'currencyReserveIncrease', 'Reserve has been increased!', res => {
        NotificationManager.success('Reserve has been increased!', null, 5000);
        dispatch(setBodyModalParamsAction(null, {}));
      });
      setIsPending(false);
    }
  }, []);

  return (
    <div className="modal-box">
      <form className="modal-form">
        <div className="form-group-app">
          <button type="button" onClick={closeModal} className="exit">
            <i className="zmdi zmdi-close" />
          </button>
          <div className="form-title">
            <p>
              Reserve Currency -
              {modalData.code}
            </p>
            <br />
          </div>
          <div className="form-group mb-15">
            <label>
              Reserve supply
            </label>
            <div>
              <span>{modalData.reserveSupply / (10 ** modalData.decimals)}</span>
            </div>
          </div>
          <div className="form-group mb-15">
            <label>
              Initial supply included
            </label>
            <div>
              <span>
                {modalData.initialSupply / (10 ** modalData.decimals)}
              </span>
            </div>
          </div>
          <div className="form-group mb-15">
            <label>
              Target reserve
            </label>
            <div>
              <span>
                {modalData.minReservePerUnitATM / (10 ** modalData.decimals)}
              </span>
            </div>
          </div>
          <div className="form-group mb-15">
            <label>
              Current reserve
            </label>
            <div>
              <span>
                {modalData.currentReservePerUnitATM / (10 ** modalData.decimals)}
              </span>
            </div>
          </div>
          <ModalBody
            modalTitle="Claim Currency"
            isAdvanced
            isFee
            closeModal={closeModal}
            handleFormSubmit={handleFormSubmit}
            submitButtonName="Claim Currency"
            nameModel={nameModal}
          >
            <ReserveCurrencyForm />
          </ModalBody>
        </div>
      </form>
    </div>
  );
}
