import React, { useEffect, useRef } from 'react';
import IMask from 'imask';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getTickerSelector } from 'selectors';

export const AccountInputBase = ({ onChange, className, ...props }) => {
  const ref = useRef(null);
  const ticker = useSelector(getTickerSelector);

  useEffect(() => {
    let mask;
    if(ref.current) {
      mask = IMask(ref.current, {
        mask: `${ticker}-####-####-####-#####`,
        definitions: {
          '#': /[A-Za-z0-9]/
        },
        prepare: function (str) {
          return str.toUpperCase();
        },
      });

      const handleChange = () => {
        onChange(mask.value);
      };
      mask.on("accept", handleChange);
    }
    return () => {
      mask.destroy();
    }
  }, [ref.current]);

  return (
    <input
      {...props}
      ref={ref}
      autoComplete="off" 
      className={classNames("form-control", className)}
    />
  );
}
