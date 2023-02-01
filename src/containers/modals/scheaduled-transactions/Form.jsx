import React, { useEffect,  } from 'react';
import { useFormikContext } from "formik";
import NumericInput from "containers/components/form-components/NumericInput";
import AccountRS from 'containers/components/form-components/AccountRS';
import CurrencyInput from 'containers/components/form-components/CurrencyInput';
import FeeInput from 'containers/components/form-components/FeeInput/fee-input1';
import { useDispatch, useSelector } from 'react-redux';
import {getCurrencyAction} from "actions/currencies";
import { getTickerSelector } from 'selectors';

export const Form = () => {
  const dispatch = useDispatch();
  const ticker = useSelector(getTickerSelector);
  const formik = useFormikContext();

  useEffect(() => {
    if (formik.values.code) {
      dispatch(getCurrencyAction({ code: formik.values.code }))
        .then(result => {
          formik.setFieldValue('holding', result?.currency ?? '');
          formik.setFieldValue('create_poll_ms_id', result?.currency ?? '');
        });
    }
  }, [formik.values.code]);

  return (
    <>
      <CurrencyInput
        label="Currency code"
        currencyCodeName="code"
        currencyIdName="currency"
        currencyDecimalsName="currencyDecimals"
        placeholder="Code"
      />
      <NumericInput
        name="rateATM"
        placeholder="Rate"
        type="float"
        label="Rate"
        counterLabel={ticker}
      />
      <NumericInput
        name="units"
        placeholder="Units"
        type="float"
        label="Units"
        counterLabel={ticker}
      />
      <AccountRS
        name="offerIssuer"
        placeholder="Issuer"
        label="Issuer"
      />
      <FeeInput
        name="feeATM"
        placeholder="Fee"
        type="float"
      />
    </>
  );
}