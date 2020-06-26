import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-form';
import { CheckboxFormInput } from '../../components/form-components/check-button-input';
import AccountRSFormInput from '../../components/form-components/account-rs';
import AccountRS from '../../components/form-components/account-rs1';
import NummericInputForm from '../../components/form-components/numeric-input';
import InfoBox from '../../components/info-box';
import FeeInputForm from '../../components/form-components/fee-input';

const SendPrivateMoneyForm = ({
  values, setValue, modalData, idGroup, useMixer, mixerData, handleUseMixer,
}) => (
  <>
    <AccountRS
      name="recipient"
      label="Recipient"
      placeholder="Recipient"
      id={`${idGroup}recipient-field`}
    />
    {useMixer && (
      <>
        <Text
          type="hidden"
          field="mixerAccount"
          defaultValue={mixerData && mixerData.rsId}
        />
        <Text
          type="hidden"
          field="mixerPublicKey"
          defaultValue={mixerData && mixerData.publicKey}
        />
      </>
    )}
    {useMixer && (
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
    <NummericInputForm
      field="amountATM"
      counterLabel="APL"
      type="tel"
      label="Amount"
      setValue={setValue}
      placeholder="Amount"
      idGroup={idGroup}
      defaultValue={(modalData && modalData.amountATM) ? modalData.amountATM : ''}
    />
    {mixerData && (
      <CheckboxFormInput
        checkboxes={[
          {
            field: 'isMixer',
            label: 'Use Mixer',
            defaultValue: useMixer,
            handler: handleUseMixer,
          },
        ]}
      />
    )}
    {useMixer && (
      <NummericInputForm
        field="duration"
        counterLabel="Minutes"
        type="float"
        label="Mixing time"
        setValue={setValue}
        placeholder="Duration"
        idGroup={idGroup}
        defaultValue={(modalData && modalData.duration) ? modalData.duration : ''}
      />
    )}
    <FeeInputForm
      field="feeATM"
      values={values}
      setValue={setValue}
      idGroup={idGroup}
      defaultValue={(modalData && modalData.feeATM) || '5'}
    />
  </>
);

const mapStateToProps = state => ({ modalData: state.modals.modalData });

export default connect(mapStateToProps)(SendPrivateMoneyForm);
