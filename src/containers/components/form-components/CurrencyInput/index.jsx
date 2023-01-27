import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getCurrencyAction } from 'actions/currencies';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';

export default function CurrencyInput(props) {
  const dispatch = useDispatch();

  const [currency, setCurrency] = useState('-');

  const { name, disabled, code } = props;

  const getCurrency = useCallback(async reqParams => {
    const result = await dispatch(getCurrencyAction(reqParams));

    if (result) {
      setCurrency(result.currency);
    } else {
      setCurrency('-');
    }
  }, [dispatch]);

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
          {currency}
        </span>
      </div>
    </CustomInput>
  );
}
