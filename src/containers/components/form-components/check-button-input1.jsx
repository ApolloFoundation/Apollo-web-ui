import React from 'react';
import { Checkbox } from 'react-form';

export const CheckboxFormInput = props => {
  const {
    options, labelGroup, idGroup, setValue, className, onChange,
  } = props;

  return (
    <div className={`mb-15 ${className}`}>
      {labelGroup && (
      <label>{labelGroup}</label>
      )}

      {options.map((el, index) => (
        <div className="checkbox-group" key={index}>
          <Checkbox
            className="lighten"
            onChange={e => {
              if (setValue) setValue(el.name, e);
              if (el.handler) el.handler(e);
              onChange && onChange(e);
            }}
            defaultValue={el.defaultValue}
            field={el.name}
            id={`${idGroup}-${el.name}-field`}
          />
          <label
            htmlFor={`${idGroup}-${el.name}-field`}
          >
            {el.label}
          </label>
        </div>
      ))}
    </div>
  );
};
