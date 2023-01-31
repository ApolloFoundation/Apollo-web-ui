import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import { getCurrencyAction } from 'actions/currencies';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';

export default function CurrencyInput({ name, disabled, code }) {
  const dispatch = useDispatch();
  const formik = useFormikContext();

  const getCurrency = useCallback(async reqParams => {
    const result = await dispatch(getCurrencyAction(reqParams));

    if (result) {
      // these field important for transfer currecy modal
      formik.setFieldValue('currency', result.currency);
      formik.setFieldValue('decimals', result.decimals);
    } else {
      formik.setFieldValue('currency', '-');
    }
  }, [dispatch, formik.setFieldValue]);

  const handleChange = useCallback((code) => {
    getCurrency({ code })
  }, [getCurrency]);

  useEffect(() => {
    if (code) {
      getCurrency({ code });
    }
  }, [code]);

  return (
    <CustomInput
      label="Currency"
      name={name}
      placeholder="Code"
      onChange={handleChange}
      disabled={disabled}
    >
      <div className="input-group-append">
        <span className="input-group-text">
          ID:
          {formik.values.currency ?? '-'}
        </span>
      </div>
    </CustomInput>
  );
}
