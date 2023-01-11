import React, { useEffect,  } from 'react';
import { useFormikContext, Field } from "formik";
import TextualInput from "../../components/form-components/TextualInput";
import AccountRS from '../../components/form-components/AccountRS';
import { CurrencyInput } from '../../components/form-components-new/CurrencyInput';
import FeeInput from '../../components/form-components/FeeInput/fee-input1';
import { useDispatch, useSelector } from 'react-redux';
import {getCurrencyAction} from "../../../actions/currencies";
import { getTickerSelector } from '../../../selectors';

// TODO fix styles (TextualComponent)
export const Form = () => {
  const dispatch = useDispatch();
  const ticker = useSelector(getTickerSelector);
  const formik = useFormikContext();

  useEffect(() => {
    if (formik.values.code) {
      dispatch(getCurrencyAction({ code: formik.values.code }))
        .then(result => {
          formik.setFieldValue('currency', result?.currency);
          formik.setFieldValue('currencyDecimals', result?.decimals);
          formik.setFieldValue('holding', result?.currency ?? '');
          formik.setFieldValue('create_poll_ms_id', result?.currency ?? '');
        });
    }
  }, [formik.values.code]);

  return (
    <>
      <Field
        label="Currency code"
        name="code"
        component={CurrencyInput}
        placeholder="Code"
      />
      <TextualInput
        name="rateATM"
        placeholder="Rate"
        type="float"
        label="Rate"
        code={ticker}
      />
      <TextualInput
        name="units"
        placeholder="Units"
        type="float"
        label="Units"
        code={ticker}
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