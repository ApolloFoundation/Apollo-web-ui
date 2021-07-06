import React from 'react';
import { useField } from 'formik';

export default function InputRange({ name, disabled, onChange, min, max }) {
  const [field, , helpers] = useField(name);

  const { setValue, setTouched, onBlur } = helpers;

  return (
    <div className="range-wrap mb-3">
      <div
        className={`range-value ${disabled ? 'disabled' : ''}`}
        style={{ left: `calc((100% - 30px) * ${field.value} / 100)` }}
      >
        {field.value || min}
        %
      </div>
      <input
        {...field}
        value={field.value || min}
        onChange={e => {
          setValue(e.target.value);
          if (onChange) {
            onChange(e.target.value, e);
          }
        }}
        onBlur={e => {
          setTouched();
          if (onBlur) {
            onBlur(e);
          }
        }}
        className="input-range"
        type="range"
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
}