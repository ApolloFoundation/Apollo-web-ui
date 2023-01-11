import React, { useCallback, useEffect } from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const CheckboxFormInput = props => {
  const {
    label, name, id, className, disabled, onChange, value, isTopOffset,
  } = props;

  const [field, , helpers] = useField({
    name, id, type: 'checkbox', disabled,
  });
  
  const { setValue } = helpers;

  const handleChange = useCallback((e) => {
      const { checked } = e.target;
    setValue(checked);
    if (onChange) onChange(e);
  }, [onChange, setValue]);

  return (
    <div className={cn('checkbox-group mb-15', className, { 'checkbox-group--top': isTopOffset})}>
      <input
        {...field}
        type="checkbox"
        className="checkbox"
        disabled={disabled}
        onChange={handleChange}
        id={id}
      />
      <label
        htmlFor={id}
        className="checkbox-label"
      >
        {label}
      </label>
    </div>
  );
};

PropTypes.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
};

export default CheckboxFormInput;
