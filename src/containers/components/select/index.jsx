/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import Select from 'react-select';

import './Select.scss';

export default function CustomSelect({
  options, name, defaultValue, onChange, value, onBlur,
}) {

  const handleChange = useCallback(({ value }) => {
    if (onChange) onChange(value);
  }, [onChange]);

  return (
    <Select
      name={name}
      value={options ? options.find(option => option.value === value) : ''}
      className="form-custom-select"
      classNamePrefix="custom-select-box"
      options={options}
      defaultValue={defaultValue}
      onChange={handleChange}
      onBlur={onBlur}
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
