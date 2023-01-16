import { useField } from 'formik';
import React, { useCallback } from 'react';
import AccountRS from './';

export const AccountRSWithFormik = ({ name, onChange, ...props }) => {
  const [field, _, helpers] = useField(name);

  // value is parsed data (string)
  const handleChange = useCallback((value) => {
    helpers.setValue(value);
    helpers.setTouched(true);

    if (onChange) onChange(value);
  }, [helpers.setValue, helpers.setTouched, onChange]);

  return <AccountRS {...props} name={name} onChange={handleChange} value={field.value} />
}