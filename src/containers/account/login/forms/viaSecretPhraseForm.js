import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { Form, Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { getAccountDataBySecretPhrasseAction } from '../../../../actions/login';
import InfoBox from '../../../components/info-box';
import Input from '../../../components/custom-input';
import Button from '../../../components/button';

export default function SecretPhraseForm({ activeTab }) {
  const dispatch = useDispatch();

  const enterAccountByPassphrase = useCallback(({ secretPhrase }) => {
    if (!secretPhrase || !secretPhrase.length) {
      NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
      return;
    }

    dispatch(getAccountDataBySecretPhrasseAction({ secretPhrase }));
  }, [dispatch]);

  return (
    <Formik
      initialValues={{}}
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
          <Input
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
