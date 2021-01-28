import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getCurrencyAction } from '../../../actions/currencies';
import CustomInput from '../custom-input';

const CurrencyInput = ({setFieldValue, name, disabled, values}) => {
  const dispatch = useDispatch();

  const [currency, setCurrency] = useState('-');

  const getCurrency = useCallback(async reqParams => {
    const result = await dispatch(getCurrencyAction(reqParams));

    if (result) {
      setCurrency(result.currency);
      if (setFieldValue) {
        setFieldValue('decimals', result.decimals);
        setFieldValue('currency', result.currency);
      }
    } else {
      setCurrency('-');
    }
  }, [setFieldValue, dispatch]);

  useEffect(() => {
    const defaultValue = values.code;
    if (defaultValue) {
      getCurrency({ code: defaultValue });
    }
  }, []);

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

export default CurrencyInput
