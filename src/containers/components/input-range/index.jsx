import React from 'react';
import classNames from 'classnames';

export default function InputRange({ name, disabled, onBlur, onChange, min, max, value, ...rest }) {
  return (
    <div className="range-wrap mb-3">
      <div
        className={classNames('range-value', { 'disabled': disabled })}
        style={{ left: `calc((100% - 30px) * ${value} / 100)` }}
      >
        {value || min}
        %
      </div>
      <input
        {...rest}
        name={name}
        value={value || min}
        onChange={onChange}
        onBlur={onBlur}
        className="input-range"
        type="range"
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
}
