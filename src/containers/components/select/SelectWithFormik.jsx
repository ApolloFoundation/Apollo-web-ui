import { useField } from 'formik';
import React, { useCallback } from 'react';
import CustomSelect from './';

export const SelectWithFormik = ({ name, ...rest}) => {
  const [field, _, helpers] = useField(name);

  const handleChange = useCallback((value) => {
    helpers.setValue(value);
  }, [helpers.setValue]);
  
  return (
    <CustomSelect {...rest} {...field} onChange={handleChange} />
  )
}