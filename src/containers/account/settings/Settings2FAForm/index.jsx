import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { FormikProvider, Form, useFormik } from 'formik';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { disable2FAActon, enable2FAActon } from '../../../../actions/account';
import ModalFooter from '../../../components/modal-footer';
import AccountRSFormInput from '../../../components/form-components/AccountRS';
import { get2FASelector } from '../../../../selectors';
import InfoBox from '../../../components/info-box';

export const Settings2FAForm = ({ account, setState, getAccountInfo }) => {
  const dispatch = useDispatch();
  const is2FA = useSelector(get2FASelector);


  const formik = useFormik({
    initialValues: {
      account: '',
      secretPhrase: '',
      code2FA: '',
    },
    onSubmit: handleSubmit2FA,
  })

  const disable2fa = async (values) => {
    if (!values.account) {
      NotificationManager.error('Account ID is not specified.', 'Error', 5000);
      return;
    }
    // it is a redux action but some special)
    const status = await disable2FAActon({
      passphrase: values.secretPhrase,
      account: values.account,
      code2FA: values.code2FA,
    });

    if (status.errorCode) {
      NotificationManager.error(status.errorDescription, null, 5000);
    } else {
      formik.resetForm();
      getAccountInfo();
      NotificationManager.success('2FA was successfully disabled.', null, 5000);
    }
  };

  const getQRCode = async (values) => {
    if (!values.account) {
      NotificationManager.error('Account ID is not specified.', 'Error', 5000);
      return;
    }
    // it is a redux action but some special)
    const status = await enable2FAActon({
      passphrase: values.secretPhrase,
      account: values.account,
    });

    if (status.errorCode) {
      NotificationManager.error(status.errorDescription, null, 5000);
    } else {
      dispatch(setBodyModalParamsAction('CONFIRM_2FA_OPERATION', {
        ...status,
        passphrase: values.secretPhrase,
        account: values.account,
        operation: 'enable 2FA',
        settingsReloader: () => {
          formik.resetForm();
          getAccountInfo();
        },
      }));

      setState(prevState => ({ 
        ...prevState,
        info2fa: status
      }));
    }
  };

  function handleSubmit2FA (values) {
    account.is2FA ? disable2fa(values) : getQRCode(values);
  }

  return (
    <FormikProvider value={formik}>
      <Form className="modal-form">
        <div className="form-group-app">
          {is2FA
            ? (
              <>
                <div className="form-sub-title mb-3">
                  The 2FA is currently enabled on this account.
                </div>
              </>
            ) : (
              <div className="form-sub-title mb-3">
                The 2FA is currently disabled on this account. You can
                increase
                your wallet security with this option.
              </div>
            )}
          <InfoBox attentionLeft>
            <p className="mb-3">
              Please note:
            </p>
            <div className="form-sub-title">
              2FA is a feature for Vault addresses only,
              and will not add a second factor authentication to a standard address.
            </div>
          </InfoBox>
          <AccountRSFormInput
            noContactList
            name="account"
            label="Account ID"
            placeholder="Account ID"
          />
          <ModalFooter />
          {account && (
          <div>
            <button type="submit" className="btn btn-green">
              {!account.is2FA ? 'Get Qr code' : 'Confirm disable'}
            </button>
          </div>
          )}
        </div>
      </Form>
    </FormikProvider>
  );
}
