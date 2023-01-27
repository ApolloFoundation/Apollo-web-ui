import { useField } from 'formik';
import React, { useCallback } from 'react';
import InputRange from './';

export const InputRangeWithFormik = ({ name, min, max, onChange, ...rest }) => {
  const [field] = useField(name);

  const handleChange = useCallback((e) => {
    field.onChange(e);
    if (onChange) onChange(e);
  }, [field.onChange, onChange]);
  
  return (
    <InputRange name={name} {...rest} {...field} onChange={handleChange} />
  )
}