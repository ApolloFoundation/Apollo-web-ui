/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect } from 'react';
import { useField } from 'formik';
import Select from 'react-select';

import './Select.scss';

export default function CustomSelect({
  options, name, defaultValue, onChange,
}) {
  const [{value, ...field}, , helpers] = useField(name);

  const handleChange = ({ value }) => {
    helpers.setValue(value);
    if (onChange) onChange();
  };

  useEffect(() => {
    if (defaultValue) {
      helpers.setValue(defaultValue.value);
    }
  }, []);

  return (
    <Select
      {...field}
      value={options ? options.find(option => option.value === field.value) : ''}
      className="form-custom-select"
      classNamePrefix="custom-select-box"
      options={options}
      defaultValue={defaultValue}
      onChange={handleChange}
      theme={theme => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary: 'black',
        },
      })}
    />
  );
}
