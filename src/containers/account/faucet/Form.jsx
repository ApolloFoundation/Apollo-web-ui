import React from 'react';
import { useFormik, Form, FormikProvider } from "formik";
import { useDispatch } from 'react-redux';
import {NotificationManager} from 'react-notifications';
import InfoBox from 'containers/components/info-box';
import {AccountRSWithFormik} from 'containers/components/account-rs/AccountRSWithFormik';
import {getCoins} from 'actions/faucet';
import { FAUCET_APL_AMOUNT } from 'constants/constants';

export const FaucetForm = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    onSubmit: handleSubmit,
    initialValues: {
      accountRS: '',
    },
  });

  async function handleSubmit ({ accountRS }) {
    if (!accountRS || accountRS.length === 0) {
      NotificationManager.error('Account ID is required.', 'Error', 5000);
      return;
    }

    const result = await dispatch(getCoins({
      address: accountRS
    }));

    if (result) {
        if (result.success) {
          NotificationManager.success(`Success! Sent ${FAUCET_APL_AMOUNT} APL to your address`, null, 5000);
          formik.handleReset();
        } else {
          NotificationManager.error(result.message, 'Error', 5000);
        }
    }
  }

  return (
    <FormikProvider value={formik}>
      <Form className="tab-body mt-4 active">
        <InfoBox className={'green-text'} transparent>
          Get free 30,000 APL every 60 minutes
        </InfoBox>
        <div className="input-group-app user">
          <div>
            <label htmlFor="recipient">
              Enter your testnet account address
            </label>
            <div>
              <div className="iconned-input-field">
                <AccountRSWithFormik
                    name='accountRS'
                    placeholder='Account ID'
                />
              </div>    
            </div>
          </div>
        </div>
        <button
            type="submit"
            name='closeModal'
            className="btn"
        >
            Get testnet APL
        </button>
      </Form>
    </FormikProvider>
  );
}