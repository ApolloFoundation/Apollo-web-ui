/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useField } from 'formik';
import Select from 'react-select';

import './Select.scss';

export default function CustomSelect({
  options, name, defaultValue, onChange,
}) {
  const [field, , helpers] = useField(name);

  const handleChange = value => {
    helpers.setValue(value);
    if (onChange) onChange();
  };

  return (
    <Select
      {...field}
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