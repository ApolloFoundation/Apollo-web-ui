import React from 'react';
import { useDispatch } from 'react-redux';
import { processAccountRStoID } from 'apl-web-crypto';
import { useFormikContext } from 'formik';
import { searchAliases } from 'actions/aliases';
import AutoComplete from 'containers/components/auto-complete';
import { CheckboxWithFormik } from 'containers/components/check-button-input/CheckboxWithFormik';
import CheckboxFormInputPure from 'containers/components/check-button-input';
import AccountRSForm from 'containers/components/form-components/AccountRS';
import NumericInput from 'containers/components/form-components/NumericInput';
import { MessageInputs } from 'containers/components/form-components/MessageInputs';
import { InputWithScaner } from 'containers/components/form-components/InputWithScaner';

const newAliasValidation = /APL-[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{5}/;
const oldAliasValidation = /^acct:(APL-[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{4}-[[A-Z0-9]{5})@apl$/i;

export default function SendMoneyForm({
  idGroup, onPrivateTransactionChange, ticker,
  isShowPrivateTransaction,
}) {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();

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

  const handleAliasChange = ({ value }) => {
    setFieldValue('alias', value);
  }

  return (
    <>
      {!values.aliasCheckbox && (
        <InputWithScaner
          name="recipient"
          label="Recipient"
          placeholder="Recipient"
        />
      )}
      <CheckboxWithFormik
        name="aliasCheckbox"
        id="aliasCheckbox"
        label="Use alias?"
        defaultValue={false}
      />
      {values.aliasCheckbox && (
        <AutoComplete
          placeholder="Alias"
          label="Alias"
          onChange={handleAliasChange}
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
      <CheckboxFormInputPure
        label="Send Privately"
        onChange={onPrivateTransactionChange(true)}
        checked={isShowPrivateTransaction}
        id="open-private-transaction-from-modal"
      />
      <MessageInputs idGroup="SendMoneyForm" />
    </>
  );
}
