import React, { useEffect, useRef, useState } from 'react';
import IMask from 'imask';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getTickerSelector } from 'selectors';

export const AccountInputBase = ({ onChange, className, ...props }) => {
  const maskRef = useRef(null);
  const ticker = useSelector(getTickerSelector);
  const [val, setVal] = useState(props.value ?? '');

  useEffect(() => {
    maskRef.current = IMask.createMask({
        mask: `[${ticker}]-####-####-####-#####`,
        definitions: {
          '#': /[A-Za-z0-9]/
        },
        prepare: function (str) {
          return str.toUpperCase();
        },
    });
  }, [ticker]);

  useEffect(() => {
    setVal(props.value ?? '');
  }, [props.value]);

  const handleChange = ({ target }) => {
    const { value } = target;
    const maskedValue = maskRef.current.resolve(value);
    setVal(maskedValue);
    if (onChange) {
      onChange(maskedValue);
    }
  }

  return (
    <input
      {...props}
      autoComplete="off" 
      className={classNames("form-control", className)}
      value={val}
      onChange={handleChange}
    />
  );
}
