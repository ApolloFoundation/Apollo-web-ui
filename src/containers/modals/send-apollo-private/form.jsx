import React from 'react';
import { useFormikContext } from 'formik';
import CheckboxForm from '../../components/check-button-input/CheckboxWithFormik';
import AccountRS from '../../components/form-components/AccountRS';
import NumericInput from '../../components/form-components/NumericInput';
import FeeInput from '../../components/form-components/FeeInput/fee-input1';
import InfoBox from '../../components/info-box';

const SendPrivateMoneyForm = ({ idGroup, mixerData, ticker }) => {
  const { values } = useFormikContext();
  return (
  <>
    <AccountRS
      name="recipient"
      label="Recipient"
      placeholder="Recipient"
      id={`${idGroup}recipient-field`}
    />
    {values.isMixer && (
      <InfoBox info>
        Your money will be sent directly to mixer account and during estimated mixing
        time, money will be transferred to recipient's account.
        <br />
        Disclaimer:
        <br />
        the fee does not include any fees deducted from the mixing process itself.
        The amount that arrives at the destination is dependent on the amount of wallets used to mask this transaction.
        Each wallet passed through will incur a fee.
      </InfoBox>
    )}
    <NumericInput
      name="amountATM"
      counterLabel={ticker}
      type="tel"
      label={`Amount ${ticker}`}
      placeholder={`Amount ${ticker}`}
      idGroup={idGroup}
    />
    {mixerData && (
      <CheckboxForm
        id="isMixer"
        name="isMixer"
        label="Use Mixer"
      />
    )}
    {values.isMixer && (
      <NumericInput
        name="duration"
        counterLabel="Minutes"
        type="float"
        label="Mixing time"
        placeholder="Duration"
        idGroup={idGroup}
      />
    )}
    <FeeInput
      name="feeATM"
      values={values}
      idGroup={idGroup}
    />
  </>
)
}

export default SendPrivateMoneyForm;
