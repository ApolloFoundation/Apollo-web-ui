import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import CustomInput from '../../custom-input';
import styles from './index.module.scss';

export default function BlockHeightInput(props) {
  const { actualBlock } = useSelector(state => state.account);

  const {
    label, name, isSubtitle,
    placeholder, className, idGroup,
  } = props;

  // useEffect(() => {
  //   setValue(field, actualBlock);
  // }, [actualBlock, field, setValue]);

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
