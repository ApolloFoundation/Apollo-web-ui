import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { getAccountDataBySecretPhrasseAction, getAccountDataAction } from 'actions/login';
import InfoBox from 'containers/components/info-box';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import Button from 'containers/components/button';
import { AccountRSWithFormik } from 'containers/components/account-rs/AccountRSWithFormik';
import { Switcher } from 'containers/components/form-components/switcher/switcher';
import './standartForm.scss';

export default function SecretPhraseForm({ activeTab }) {
  const dispatch = useDispatch();
  
  const [showPhrase, setShowPhraze] = useState(false);
  
  const handeError = (name) => {
    NotificationManager.error(`${name} is required.`, 'Error', 5000);
  }

  const enterAccountByPassphrase = useCallback(({ secretPhrase, accountRS }) => {
    const isNoSecretPhrase = !secretPhrase || !secretPhrase.length;
    const isNoAccountRS = !accountRS || !accountRS.length;

    if (isNoSecretPhrase && showPhrase) {
      handeError('Secret Phrase');
      return;
    }

    if (isNoAccountRS && !showPhrase) {
      handeError('Account ID');
      return;
    }

    if (!showPhrase) {
      dispatch(getAccountDataAction({ account: accountRS }));
    } else {
      dispatch(getAccountDataBySecretPhrasseAction({ secretPhrase }));
    }
  }, [dispatch, showPhrase]);

  const handleShowPhaze = useCallback(
    () => setShowPhraze(state => !state),
    [setShowPhraze]
  );

  const label = showPhrase ? 'Switch to the ID input field' : 'Switch to the secret phrase input field';

  return (
    <Formik
      initialValues={{ 
        secretPhrase: '',
        accountRS: '',
      }}
      onSubmit={enterAccountByPassphrase}
    >
      <Form
        className={cn({
          'tab-body': true,
          active: true,
        })}
      >
        <InfoBox className="green-text" transparent>
          This option works only for standard wallets.
        </InfoBox>
        <div className="d-flex flex-column">
          {showPhrase ? (
            <CustomInput
              className="form-control"
              name="secretPhrase"
              label="Secret Phrase"
              placeholder="Secret Phrase"
              type="password"
            />
          ) :(
            <div className="input-group-app user">
              <label htmlFor="Account_id">Enter your ID or choose from saved</label>
              <AccountRSWithFormik
                name="accountRS"
                placeholder="Account ID"
                id="Account_id"
              />
            </div>
          )}
        </div>
        <div className="d-flex flex-column">
          <Switcher
            name="isCustomPassphrase"
            label={label}
            onChange={handleShowPhaze}
            id="show-phrase"
          />
        </div>
        <Button
          type="submit"
          name="Initiate"
          className="btn"
        />
      </Form>
    </Formik>
  );
}
