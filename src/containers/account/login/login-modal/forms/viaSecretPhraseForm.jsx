import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import InputMask from 'react-input-mask';
import CheckboxFormInput from 'containers/components/check-button-input';
import { getAccountDataBySecretPhrasseAction } from 'actions/login';
import InfoBox from 'containers/components/info-box';
import CustomInput from 'containers/components/custom-input';
import Button from 'containers/components/button';
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
          <InputMask
            className="form-control"
            mask={`APL-****-****-****-*****`}
            placeholder='Account ID'
          />
        </div>
        <div className="d-flex flex-column">
          <CheckboxFormInput
            name="isCustomPassphrase"
            label="Use custom secret phrase"
            onChange={handleShowPhaze}
            id="show-phrase"
          />
        </div>
        
        <div 
          className={
            cn( "d-flex flex-column standart-form__phraze",
              {"standart-form__phraze--hidden" : !showPhrase }
            )
          }
        >
          <CustomInput
            className="form-control"
            name="secretPhrase"
            label="Secret Phrase"
            placeholder="Secret Phrase"
            type="password"
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
