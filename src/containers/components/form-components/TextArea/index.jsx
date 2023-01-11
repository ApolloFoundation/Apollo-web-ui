import React from 'react';
import { useField } from 'formik';
// import { TextArea } from 'react-form';

const CustomTextArea = ({
  label, name, placeholder, note, className, idGroup, rows, cols, labelStyle,
}) => {
  const [field, , helpers] = useField(name);

  return (
    <div className={`form-group mb-15 ${className}`}>
      <label className={labelStyle}>
        {label}
      </label>
      <div>
        <textarea
          {...field}
          className="form-control"
          placeholder={placeholder}
          cols={cols || '30'}
          rows={rows || '5'}
          id={`${idGroup}${name}-field`}
        />
        {note && (
          <div className="form-sub-title align-margin-top align-left">
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomTextArea;
