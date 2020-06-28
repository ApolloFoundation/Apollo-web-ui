import React from 'react';
import { useDispatch } from 'react-redux';
import { processAccountRStoID } from 'apl-web-crypto';
import { searchAliases } from '../../../actions/aliases';
import { setBodyModalParamsAction } from '../../../modules/modals';
import CustomInputForm from '../../components/form-components/textual-input';
import CustomTextArea from '../../components/form-components/text-area1';
import AutoComplete from '../../components/auto-complete';
import CheckboxFormInput from '../../components/check-button-input';
import AccountRSForm from '../../components/form-components/account-rs1';
import NumericInput from '../../components/form-components/numeric-input1';

const newAliasValidation = /APL-[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{5}/;
const oldAliasValidation = /^acct:(APL-[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{5})@apl$/i;

export default function SendMoneyForm({
  values, idGroup, onChangeAlias, onChosenTransactionOnAlias,
}) {
  const dispatch = useDispatch();

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
        label="Amount APL"
        counterLabel="APL"
        type="tel"
        placeholder="Amount"
        idGroup={idGroup}
      />
      <CustomInputForm
        hendler={() => dispatch(setBodyModalParamsAction('SEND_APOLLO_PRIVATE', { ...values, feeATM: 5 }))}
        label="Private transaction"
        id="open-private-transaction-from-modal"
        type="button"
        idGroup={idGroup}
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
