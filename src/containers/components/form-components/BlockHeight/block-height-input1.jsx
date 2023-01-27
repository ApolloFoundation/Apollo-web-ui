import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { getActualBlockSelector } from 'selectors';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import styles from './index.module.scss';

export default function BlockHeightInput(props) {
  const actualBlock = useSelector(getActualBlockSelector);
  const formik = useFormikContext();

  const {
    label, name, isSubtitle,
    placeholder, className, idGroup,
  } = props;

  useEffect(() => {
    if (!formik.values[props.name]) {
      formik.setFieldValue(props.name, actualBlock);
    }
  }, [actualBlock]);

  return (
    <div className={`form-group mb-15 ${className}`}>
      <div className={!isSubtitle && actualBlock && 'input-group'}>
        <CustomInput
          name={name}
          label={label}
          type="tel"
          placeholder={placeholder}
          id={`${idGroup}${name}-field`}
        />
        {!isSubtitle && actualBlock && (
          <div className={classNames("input-group-append", styles.heightCount)}>
            <span className="input-group-text" id="finishHeightText">{!isSubtitle && actualBlock}</span>
          </div>
        )}
      </div>
      {isSubtitle && (
        <div className="text-note">
          Current height:
          <b>{actualBlock}</b>
        </div>
      )}
    </div>
  );
}
