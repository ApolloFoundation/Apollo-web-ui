/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import classNames from 'classnames';
import { openPrevModal, setBodyModalParamsAction } from '../../../modules/modals';
import { confirm2FAActon } from '../../../actions/account';
import InfoBox from '../../components/info-box';
import BackForm from '../modal-form/modal-form-container';
import CustomInput from 'containers/components/custom-input';
import { getModalDataSelector, getModalHistorySelector } from 'selectors';

const Confirm2FA = (props) => {
  const dispatch = useDispatch();
  const modalData = useSelector(getModalDataSelector);
  const modalsHistory = useSelector(getModalHistorySelector);

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
            dispatch(setBodyModalParamsAction(null, {}));
            props.closeModal();

            NotificationManager.success('2FA was successfully enabled!', null, 5000);
          }
        }
        setState({ isPending: false });
      }
    }, [dispatch, props.closeModal, dispatch, modalData.passphrase, modalData.account, state.isPending]);

  const handleOpenPrevModal = () => dispatch(openPrevModal());

  return (
    <div className="modal-box">
      <BackForm
        nameModal={props.nameModal}
        onSubmit={handleFormSubmit}
      >
            <div className="form-group-app">
              <button type="button" onClick={props.closeModal} className="exit">
                <i className="zmdi zmdi-close" />
              </button>
              <div className="form-title">
                {modalsHistory.length > 1
                  && (
                    <div
                      className="backMy"
                      onClick={handleOpenPrevModal}
                    />
                  )}
                <p>Confirm 2FA enabling</p>
              </div>
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
              <div className="btn-box right-conner align-right form-footer">
                <button
                  type="submit"
                  name="closeModal"
                  className={classNames('btn btn-green submit-button', {
                    'loading btn-green-disabled': state.isPending,
                  })}
                >
                  <div className="button-loader">
                    <div className="ball-pulse">
                      <div />
                      <div />
                      <div />
                    </div>
                  </div>
                  <span className="button-text">Confirm enable</span>
                </button>
              </div>
            </div>
      </BackForm>
    </div>
  );
}

export default Confirm2FA;
