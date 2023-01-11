import React from 'react';
import { useField } from 'formik';

const CustomTextArea = ({
  label, name, placeholder, note, className, idGroup, rows, cols, labelStyle, onChange, onBlur, value, ...rest
}) => (
    <div className={`form-group mb-15 ${className}`}>
      <label className={labelStyle}>
        {label}
      </label>
      <div>
        <textarea
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          className="form-control"
          placeholder={placeholder}
          cols={cols || '30'}
          rows={rows || '5'}
          id={`${idGroup}${name}-field`}
          {...rest}
        />
        {note && (
          <div className="form-sub-title align-margin-top align-left">
            {note}
          </div>
        )}
      </div>
    </div>
  );

export default CustomTextArea;
