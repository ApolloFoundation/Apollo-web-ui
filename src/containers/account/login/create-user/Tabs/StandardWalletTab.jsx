import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { generatePDF } from 'actions/account';
import crypto from 'helpers/crypto/crypto';
import Button from 'containers/components/button';
import InfoBox from 'containers/components/info-box';
import { getTickerSelector } from 'selectors';
import { setModalType } from 'modules/modals';
import { AccountInfoMessage } from '../AccountInfoMessage';

const STEPS = {
  ONE: 'ONE',
  TWO: 'TWO',
}

export default function StandardWalletForm({ activeTab, setAccountData }) {
  const dispatch = useDispatch();

  const ticker = useSelector(getTickerSelector);
  const [step, setStep] = useState(STEPS.ONE);
  const [accountInfo, setAccountInfo] = useState(null);

  const generatePassphrase = useCallback(async () => {
    const newGeneratedPassphrase = crypto.generatePassPhraseAPL();
    const params = newGeneratedPassphrase.join(' ');
    const newGeneratedAccount = await dispatch(crypto.getAccountIdAsyncApl(params, ticker));

    setAccountInfo({
      account: newGeneratedAccount,
      secretPhrase: params,
    });
    setStep(STEPS.TWO);
  }, [dispatch, ticker]);

  const handleGeneratePDF = useCallback(() => {
    generatePDF([
      {
        name: 'Account ID',
        value: accountInfo.account,
      },
      {
        name: 'Secret Phrase',
        value: accountInfo.secretPhrase,
      },
    ]);
  }, [generatePDF, accountInfo?.account, accountInfo?.secretPhrase]);

  const handleNextStep = () => {
    dispatch(setModalType('SAVE_CREDENTIALS'));
    handleGeneratePDF();
    setAccountData(accountInfo);
  }

  return (
    <form
      className={cn({
        'tab-body': true,
        active: activeTab === 0,
      })}
    >
      <InfoBox className="dark-info marked-list">
        <ul>
          <li className="check-icon">
            You can log in to this wallet using only your
            secret phrase
          </li>
          <li className="check-icon">Available to use from any device</li>
          <li className="minus-icon">
            2FA is available only on the device where it
            was enabled
          </li>
        </ul>
      </InfoBox>
      {step === STEPS.ONE && (
        <Button
          className="btn-without"
          name="Create account"
          onClick={generatePassphrase}
        />
      )}
      {step === STEPS.TWO && (
        <div>
            <AccountInfoMessage
              secretPhrase={accountInfo.secretPhrase}
              isCustomPhrase={false}
              account={accountInfo.account}
            />
            <Button
              className="btn-without"
              name="Create account and get account info"
              type="button"
              onClick={handleNextStep}
            />
        </div>
      )}
    </form>
  );
}
