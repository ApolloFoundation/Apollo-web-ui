import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getCurrencyAction } from '../../../actions/currencies';
import CustomInput from '../custom-input';

export default function CurrencyInput(props) {
  const dispatch = useDispatch();

  const [currency, setCurrency] = useState('-');

  const { setValue, name, disabled } = props;

  const getCurrency = useCallback(async reqParams => {
    const result = await dispatch(getCurrencyAction(reqParams));

    if (result) {
      setCurrency(result.currency);
      setValue('decimals', result.decimals);
      setValue('currency', result.currency);
    } else {
      setCurrency('-');
    }
  }, [setValue, dispatch]);

  useEffect(() => {
    const defaultValue = props;
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
          setValue={setValue}
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
