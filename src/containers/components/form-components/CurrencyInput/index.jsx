import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import { getCurrencyAction } from 'actions/currencies';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';

export default function CurrencyInput({
  currencyCodeName,
  currencyIdName,
  currencyDecimalsName,
  disabled,
  code
}) {
  const dispatch = useDispatch();
  const formik = useFormikContext();

  const getCurrency = useCallback(async reqParams => {
    const result = await dispatch(getCurrencyAction(reqParams));

    if (result) {
      // these field important for transfer currecy modal
      formik.setFieldValue(currencyIdName, result.currency);
      formik.setFieldValue(currencyDecimalsName, result.decimals);
    } else {
      formik.setFieldValue(currencyIdName, '-');
    }
  }, [dispatch, formik.setFieldValue, currencyDecimalsName, currencyIdName]);

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
      name={currencyCodeName}
      placeholder="Code"
      onChange={handleChange}
      disabled={disabled}
    >
      <div className="input-group-append">
        <span className="input-group-text">
          ID:
          {formik.values[currencyIdName] ?? '-'}
        </span>
      </div>
    </CustomInput>
  );
}
