import React from 'react';
import AsyncSelect from 'react-select/async';

const AutoComplete = ({
  loadOptions, placeholder, label, onChange,
}) => (
  <>
    <label className="form-group mb-15">{label}</label>
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      placeholder={placeholder}
      onChange={onChange}
      className="form-custom-select"
      classNamePrefix="custom-select-box"
    />
  </>
);

export default AutoComplete;
