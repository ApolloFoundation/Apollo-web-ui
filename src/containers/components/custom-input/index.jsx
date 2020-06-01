import React from 'react';
import cn from 'classnames';
import { useField } from 'formik';

import './styles.scss';

export default function CustomInput(props) {
  const {
    label, className, type, disableArrows, disabled, id,
    maxValue, minValue, step, isSpecialSymbols, name, placeholder,
  } = props;
  const [field, , helpers] = useField(name);
  const { setValue } = helpers;
  const isNumberInput = (type === 'tel' || type === 'float') && !disabled && !disableArrows;

  const parseValue = value => {
    let currentValue = value;

    if (type === 'tel') {
      currentValue = currentValue.replace(/[^\d]/g, '');
    }
    if (type === 'float') {
      currentValue = currentValue.replace(',', '.');
      if (currentValue === '.') currentValue = '0.';
      currentValue = currentValue.replace(/[^\d.]|\.(?=.*\.)/g, '');
    }
    if (type === 'password' && type === 'tel' && type === 'float' && !isSpecialSymbols) {
      currentValue = currentValue.replace(/[;`'"%!#&~<>@_=*+?^${}|[\]\\]/g, '');
    }
    return currentValue;
  };

  const handleClickUp = () => {
    if (!disabled) {
      let value = field.value !== '' ? parseFloat(field.value) : 0;
      const newStep = step || 1;
      value += newStep;

      if (maxValue !== undefined && value > parseFloat(maxValue)) {
        value = maxValue;
      }

      setValue(value);
    }
  };

  const handleClickDown = () => {
    if (!disabled) {
      let value = field.value !== '' ? parseFloat(field.value) : 0;
      if (value > 0) {
        const newStep = step || 1;
        value -= newStep;
        if (value < 0) value = 0;
        if (minValue !== undefined && value < parseFloat(minValue)) {
          value = minValue;
        }

        setValue(value);
      }
    }
  };

  const handleChange = ({ target: { value } }) => {
    setValue(parseValue(value));
  };

  return (
    <div className="form-group">
      <label htmlFor={field.name}>
        {label}
      </label>
      <div className={cn('input-text-wrap', { 'input-text-number-wrap': isNumberInput })}>
        <input
          {...field}
          disabled={disabled}
          type={type}
          id={id}
          onChange={handleChange}
          placeholder={placeholder}
          className={`form-control ${className}`}
          autoComplete="on"
        />
        {isNumberInput && (
          <div className="input-number-wrap">
            <div className="input-number-up" onClick={handleClickUp} />
            <div className="input-number-down" onClick={handleClickDown} />
          </div>
        )}
      </div>
    </div>
  );
}
