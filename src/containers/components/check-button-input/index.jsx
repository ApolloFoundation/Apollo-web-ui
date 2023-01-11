import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './styles.scss';

const CheckboxFormInput = props => {
  const {
    label, name, id, className, disabled, onChange, isTopOffset, checked, value, ...rest
  } = props;

  return (
    <div className={cn('checkbox-group mb-15', className, { 'checkbox-group--top': isTopOffset})}>
      <input
        {...rest}
        value={value}
        checked={checked}
        name={name}
        onChange={onChange}
        type="checkbox"
        className="checkbox"
        disabled={disabled}
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
