/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { BallPulse } from 'containers/components/BallPulse';
import { ReactComponent as ArrowRight } from 'assets/arrow-right.svg';
import './styles.scss';

export default function Button(props) {
  const {
    onClick, name, className, type, disabled,
    color, size, isLoading, isArrow,
  } = props;

  return (
    <button
      type={type}
      className={cn('btn', `btn-${color} btn-${size} ${isLoading && 'loading'}`, className)}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading && (
        <div className="button-loader">
          <BallPulse />
        </div>
      )}
      <span className="button-text">{name}</span>
      {isArrow && (
        <div className="btn-arrow">
          <ArrowRight />
        </div>
      )}
    </button>
  );
}

PropTypes.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  color: PropTypes.oneOf(['default', 'green', 'grey', 'transparent', 'blue-link']),
  size: PropTypes.oneOf(['sm', 'lg']),
  className: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  color: 'default',
  disabled: false,
  isLoading: false,
};
