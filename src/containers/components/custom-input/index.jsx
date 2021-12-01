import React from 'react';
import cn from 'classnames';
import { useField } from 'formik';

import styles from './styles.module.scss';

export default function CustomInput(props) {
  const {
    label, className, type, disableArrows, disabled, id, children, onChange,
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
      if (!currentValue.includes('.') && currentValue.length <= 2) currentValue = Number(currentValue).toString();
      if (!value.target && currentValue.includes('.')) {
        let fract = currentValue.substring(currentValue.indexOf('.'));
        currentValue = currentValue.substring(0, currentValue.indexOf('.'));
        if (fract.length > 9) {
          fract = fract.substring(0, 9); // 8 + 1 (dot symbol)
        }
        currentValue += fract;
      }
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
          value = minValue.toLocaleString('en', { useGrouping: false, maximumFractionDigits: 8 });
        }

        setValue(value);
      }
    }
  };

  const handleChange = ({ target: { value } }) => {
    const parsedValue = parseValue(value);
    if (onChange) onChange(parsedValue);
    setValue(parsedValue);
  };

  return (
    <div className="form-group mb-0">
      <label htmlFor={field.name}>
        {label}
      </label>
      <div className={cn('input-text-wrap', { 'input-text-number-wrap': isNumberInput })}>
        <div className={styles['input-wrapper']}>
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
              <div id={`button-up-${id}`} className="input-number-up" onClick={handleClickUp} />
              <div id={`button-down-${id}`} className="input-number-down" onClick={handleClickDown} />
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
