import React from 'react';
import cn from 'classnames';
import CustomInput from '../../custom-input';
import CheckboxFormInput from '../../check-button-input';
import styles from './index.module.scss';

const NumericInput = ({
  values, label, name, countingTtile, counterLabel, placeholder, type,
  inputHint, defaultValue, disabled, disableArrows, disabledFee, idGroup,
  onChange,
}) => (
  <>
    <div className={cn("form-group", styles.numericInputWrapper)}>
      <div className={disabledFee ? 'disabled-fee-wrap' : ''}>
        <div className={cn( styles.numericInput, {
          'input-group mb-15': countingTtile || counterLabel,
          'input-group-disabled': disabled || (disabledFee && values && !values.isCustomFee),
        })}
        >
          <CustomInput
            name={name}
            placeholder={placeholder}
            label={label}
            onChange={onChange}
            type={type || 'float'}
            defaultValue={defaultValue || ''}
            id={`${idGroup}${name}-field`}
            disabled={disabled || (disabledFee && values && !values.isCustomFee)}
            disableArrows={disableArrows}
          />
          {(countingTtile || counterLabel) && (
            <div className={cn("input-group-append", styles.numericInputIcon)}>
              <span className="input-group-text">{countingTtile || counterLabel}</span>
            </div>
          )}
        </div>
        {disabledFee && (
          <CheckboxFormInput
            className="disabled-fee-checkbox"
            name="isCustomFee"
            label="Custom fee"
          />
        )}
      </div>
    </div>
    {inputHint && (
      <div className="form-group mb-15">
        <div className="form-sub-title">{inputHint}</div>
      </div>
    )}
  </>
);

export default NumericInput;