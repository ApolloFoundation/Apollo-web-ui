import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import InputMask from 'react-input-mask';
import CheckboxFormInput from '../../../../components/check-button-input';
import { getAccountDataBySecretPhrasseAction } from '../../../../../actions/login';
import InfoBox from '../../../../components/info-box';
import CustomInput from '../../../../components/custom-input';
import Button from '../../../../components/button';
import './standartForm.scss';

export default function SecretPhraseForm({ activeTab }) {
  const dispatch = useDispatch();
  
  const [showPhrase, setShowPhraze] = useState(false);
  
  const enterAccountByPassphrase = useCallback(({ secretPhrase }) => {
    if (!secretPhrase || !secretPhrase.length) {
      NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
      return;
    }

    dispatch(getAccountDataBySecretPhrasseAction({ secretPhrase }));
  }, [dispatch]);

  const handleShowPhaze = useCallback(
    () => setShowPhraze(state => !state
  ), [setShowPhraze]);

  return (
    <Formik
      initialValues={{ secretPhrase: '' }}
      onSubmit={enterAccountByPassphrase}
    >
      <Form
        className={cn({
          'tab-body': true,
          active: !!activeTab,
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
            <>
              <label htmlFor="Account_id">Enter your ID</label>
              <InputMask
                className="form-control"
                mask={`APL-****-****-****-*****`}
                placeholder='Account ID'
                id="Account_id"
              />
            </>
          )}
        </div>
        <div className="d-flex flex-column">
          <CheckboxFormInput
            name="isCustomPassphrase"
            label="Use custom secret phrase"
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
