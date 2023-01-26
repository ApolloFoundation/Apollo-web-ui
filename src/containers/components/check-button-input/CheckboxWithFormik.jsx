import React, { useCallback, useEffect } from 'react';
import { useField } from 'formik';
import CheckboxFormInput from './';

export const CheckboxWithFormik = ({ name, onChange, ...props}) => {
  const [field, ,helpers] = useField({ name, type: 'checkbox' });
  
  const handleChange = useCallback((e) => {
    field.onChange(e);
    if (onChange) onChange(e);
  }, [onChange, field.onChange]);

  useEffect(() => {
    if(props.defaultValue) {
      helpers.setValue(props.defaultValue);
    }
  }, [props.defaultValue]);

  return (
    <CheckboxFormInput {...props} {...field} name={name} onChange={handleChange} />
  );
}

export default CheckboxWithFormik;