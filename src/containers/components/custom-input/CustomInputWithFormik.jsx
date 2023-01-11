import { useField } from 'formik';
import React, { useCallback } from 'react';
import CustomInput from './index';

export const CustomInputWithFormik = ({ name, onChange, ...props}) => {
  const [field, _, helpers] = useField(name);

  // value is a string (parsed value)
  const handleChange = useCallback((value) => {
    helpers.setValue(value);
    if (onChange) onChange(value);
  }, [onChange, helpers.setValue]);

  return (
    <CustomInput {...props} {...field} name={name} onChange={handleChange} />
  );
}

export default CustomInputWithFormik;