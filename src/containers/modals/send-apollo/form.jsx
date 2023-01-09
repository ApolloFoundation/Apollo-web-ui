import React from 'react';
import { useDispatch } from 'react-redux';
import { processAccountRStoID } from 'apl-web-crypto';
import { searchAliases } from '../../../actions/aliases';
import CustomTextArea from '../../components/form-components/text-area1';
import AutoComplete from '../../components/auto-complete';
import CheckboxFormInput from '../../components/check-button-input';
import AccountRSForm from '../../components/form-components/account-rs1';
import NumericInput from '../../components/form-components/numeric-input1';
import { useFormikContext } from 'formik';

const newAliasValidation = /APL-[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{5}/;
const oldAliasValidation = /^acct:(APL-[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{5})@apl$/i;

export default function SendMoneyForm({
  idGroup, onChangeAlias, onChosenTransactionOnAlias, onPrivateTransactionChange, ticker,
  isShowPrivateTransaction,
}) {
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  const getAliasOptions = aliases => aliases.filter(({ aliasURI }) => {
    const exchangeAlias = oldAliasValidation.test(aliasURI)
      ? aliasURI.match(oldAliasValidation)[1].toUpperCase()
      : aliasURI;

    return (newAliasValidation.test(aliasURI) || oldAliasValidation.test(aliasURI))
      && processAccountRStoID(exchangeAlias);
  }).map(({ aliasName, aliasURI }) => {
    const exchangeAlias = oldAliasValidation.test(aliasURI)
      ? aliasURI.match(oldAliasValidation)[1].toUpperCase()
      : aliasURI;

    return ({
      value: exchangeAlias,
      label: `${aliasName} / ${exchangeAlias}`,
    });
  });

  return (
    <>
      {!values.alias && (
        <AccountRSForm
          name="recipient"
          label="Recipient"
          placeholder="Recipient"
        />
      )}
      <CheckboxFormInput
        onChange={onChosenTransactionOnAlias}
        name="alias"
        label="Use alias?"
      />
      {values.alias && (
        <AutoComplete
          placeholder="Alias"
          label="Alias"
          onChange={onChangeAlias}
          loadOptions={alias => dispatch(searchAliases({ aliasPrefix: alias }))
            .then(({ aliases }) => getAliasOptions(aliases))}
        />
      )}
      <NumericInput
        name="amountATM"
        label={`Amount ${ticker}`}
        counterLabel={ticker}
        type="tel"
        placeholder={`Amount ${ticker}`}
        idGroup={idGroup}
      />
      <CheckboxFormInput 
        label="Send Privately"
        name='privateTransaction'
        onChange={onPrivateTransactionChange(true)}
        value={isShowPrivateTransaction}
        id="open-private-transaction-from-modal"
      />
      <CheckboxFormInput
        name="add_message"
        label="Add a message?"
      />
      {values.add_message && (
        <>
          <CustomTextArea
            name="message"
            label="Message"
            placeholder="Message"
          />
          <CheckboxFormInput
            name="encrypt_message"
            label="Encrypt Message"
          />
          <CheckboxFormInput
            name="permanent_message"
            label="Message is Never Deleted"
          />
        </>
      )}
    </>
  );
}
