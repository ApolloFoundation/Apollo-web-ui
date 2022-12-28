import React from 'react';
import { useFormik, Form, FormikProvider } from "formik";
import { useDispatch } from 'react-redux';
import {NotificationManager} from 'react-notifications';
import InfoBox from '../../components/info-box';
import AccountRS from '../../components/account-rs/index1';
import {getCoins} from '../../../actions/faucet';

export const FaucetForm = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    onSubmit: handleSubmit,
    initialValues: {
      accountRS: '',
    },
  });

  const handleSubmit = async ({ accountRS }) => {
    if (!accountRS || accountRS.length === 0) {
      NotificationManager.error('Account ID is required.', 'Error', 5000);
      return;
    }

    const result = await dispatch(getCoins({
      address: accountRS
    }));

    if (result) {
        if (result.success) {
          NotificationManager.success('Success! Sent 30,000 APL to your address', null, 5000);
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
                <AccountRS
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