import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getCurrencyAction } from '../../../../actions/currencies';
import { TextComponentWithIcon } from '../TextComponent';

export const CurrencyInput = ({
  id,
  field,
  code,
  name,
  disabled,
}) => {
  const dispatch = useDispatch();

  const [currency, setCurrency] = useState('-');

  const getCurrency = useCallback(async (code) => {
    const result = await dispatch(getCurrencyAction({ code }));

    if (result) {
      setCurrency(result.currency);
    } else {
      setCurrency('-');
    }

  }, [dispatch]);

  useEffect(() => {
    if (code) {
      getCurrency(code);
    }
  }, [code]);

  useEffect(() => {
    getCurrency(field.value);
  }, [field.value]);

  return (
    <TextComponentWithIcon
      label="Currency"
      id={id}
      name={name}
      placeholder="Code"
      disabled={disabled}
      icon={
        <span className="input-group-text">
          ID:
          {currency}
        </span>
      }
      field={field}
    />
  );
}