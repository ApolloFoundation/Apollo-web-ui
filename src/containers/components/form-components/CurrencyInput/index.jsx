import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getCurrencyAction } from '../../../../actions/currencies';
import CustomInput from '../../custom-input/CustomInputWithFormik';

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

  useEffect(() => {
    if (code) {
      getCurrency({ code });
    }
  }, [code]);

  return (
    <div className="form-group mb-15">
      <label>
        Currency
      </label>
      <div className="input-group">
        <CustomInput
          name={name}
          placeholder="Code"
          onChange={code => getCurrency({ code })}
          disabled={disabled}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            ID:
            {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
