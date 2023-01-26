import React, { useCallback } from 'react';
import { useField } from 'formik';
import CheckboxFormInput from './index';

export const CheckboxWithFormik = ({ name, onChange, ...props}) => {
  const [field] = useField({ name, type: 'checkbox' });
  
  const handleChange = useCallback((e) => {
    field.onChange(e);
    if (onChange) onChange(e);
  }, [onChange, field.onChange]);

  return (
    <CheckboxFormInput {...props} {...field} name={name} onChange={handleChange} />
  );
}

export default CheckboxWithFormik;