import React from 'react';
import cn from 'classnames';
import CheckboxFormInput from '../check-button-input';
import CustomInput from '../custom-input';

const FeeInput = ({
  values, name, countingTtile, counterLabel = 'APL', type, idGroup,
  inputHint, defaultValue, disabled, disableArrows, disabledFee = true,
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
            placeholder="Fee"
            label="Fee"
            type={type || 'float'}
            defaultValue={defaultValue || '1'}
            id={`${idGroup}${name}-field`}
            disabled={disabled || (disabledFee && values && !values.isCustomFee)}
            disableArrows={disableArrows}
          >
            {(countingTtile || counterLabel) && (
              <div className="input-group-append">
                <span className="input-group-text">{countingTtile || counterLabel}</span>
              </div>
            )}
            {disabledFee && (
              <CheckboxFormInput
                className="disabled-fee-checkbox"
                name="isCustomFee"
                label="Custom fee"
              />
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

export default FeeInput;
