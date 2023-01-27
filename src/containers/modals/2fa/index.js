/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { confirm2FAActon } from 'actions/account';
import InfoBox from 'containers/components/info-box';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import { getModalDataSelector } from 'selectors';
import ModalBody from 'containers/components/modals/modal-body';

const Confirm2FA = (props) => {
  const dispatch = useDispatch();
  const modalData = useSelector(getModalDataSelector, shallowEqual);

  const [state, setState] = useState({
    isPending: false,
  });

  const handleFormSubmit = useCallback(async values => {
      if (!state.isPending) {
        setState({ isPending: true });
        const data = {
          ...values,
          passphrase: modalData.passphrase,
          account: modalData.account,
        };

        const confirm = await confirm2FAActon(data);

        if (confirm) {
          if (confirm.errorCode) {
            NotificationManager.error(confirm.errorDescription, 'Error', 5000);
          } else {
            if (modalData.settingsReloader) {
              modalData.settingsReloader();
            }
            props.closeModal();

            NotificationManager.success('2FA was successfully enabled!', null, 5000);
          }
        }
        setState({ isPending: false });
      }
    }, [dispatch, props.closeModal, dispatch, modalData.passphrase, modalData.account, state.isPending]);

  return (
      <ModalBody
        nameModal={props.nameModal}
        handleFormSubmit={handleFormSubmit}
        closeModal={props.closeModal}
        modalTitle="Confirm 2FA enabling"
        submitButtonName="Confirm enable"
        isDisableSecretPhrase
        isPending={state.isPending}
      >
        <div className="form-group mb-15">
          <label>Your Google Authenticate QR code:</label>
          <div>
            {
              modalData && modalData.qrCodeUrl && <img src={modalData.qrCodeUrl} alt="" />
            }
          </div>
        </div>
        <InfoBox attentionLeft>
          <p className="mb-3">
            Please note:
          </p>
          2FA is a feature for Vault addresses only,
          and will not add a second factor authentication to a standard address.
        </InfoBox>
        <div className="form-group mb-15">
          <label>Your generated secret word:</label>
          <div>
            <InfoBox info>
              {
                modalData && modalData.secret
              }
            </InfoBox>
          </div>
        </div>
        <div className="form-group mb-15">
          <div>
            <CustomInput
              label="2FA code"
              type="password"
              name="code2FA"
              placeholder="2FA code"
            />
          </div>
        </div>
      </ModalBody>
  );
}

export default Confirm2FA;
