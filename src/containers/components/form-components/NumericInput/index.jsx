import React from 'react';
import cn from 'classnames';
import CustomInput from '../../custom-input';

const NumericInput = ({
  values, label, name, countingTtile, counterLabel, placeholder, type,
  inputHint, defaultValue, disabled, disableArrows, disabledFee, idGroup,
  onChange, classNameWrapper, 
}) => (
  <>
    <div className="form-group">
      <div className={disabledFee ? 'disabled-fee-wrap' : ''}>
        <div className={cn({
          'input-group': countingTtile || counterLabel,
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
            classNameWrapper={classNameWrapper}
          >
          {(countingTtile || counterLabel) && (
            <div className="input-group-append">
              <span className="input-group-text">{countingTtile || counterLabel}</span>
            </div>
          )}
          </CustomInput>
        </div>
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