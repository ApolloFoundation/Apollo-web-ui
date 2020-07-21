import React from 'react';
import classNames from 'classnames';
import InputForm from '../input-form';
import {CheckboxFormInput} from "./check-button-input";

const NumericInput = ({
                          values, label, field, countingTtile, counterLabel, setValue, placeholder, type, idGroup,
                          inputHint, defaultValue, onChange, disabled, disableArrows, disabledFee
                      }) => (
    <>
        <div className="form-group mb-15">
            <label>
                {label}
            </label>
            <div className={disabledFee ? 'disabled-fee-wrap' : ''}>
                <div className={classNames({
                    'input-group': countingTtile || counterLabel,
                    'input-group-disabled': disabled || (disabledFee && values && !values.isCustomFee)
                })}>
                    <InputForm
                        field={field}
                        placeholder={placeholder}
                        type={type || 'float'}
                        setValue={setValue}
                        defaultValue={defaultValue || ''}
                        id={`${idGroup}${field}-field`}
                        onChange={onChange}
                        disabled={disabled || (disabledFee && values && !values.isCustomFee)}
                        disableArrows={disableArrows}
                    />
                    {(countingTtile || counterLabel) && (
                        <div className="input-group-append">
                            <span className="input-group-text">{countingTtile || counterLabel}</span>
                        </div>
                    )}
                </div>
                {disabledFee && (
                    <CheckboxFormInput
                        className={'disabled-fee-checkbox'}
                        checkboxes={[
                            {
                                field: 'isCustomFee',
                                label: 'Custom fee',
                                defaultValue: false
                            }
                        ]}
                    />
                )}
            </div>
        </div>
        {
            inputHint &&
            <div className={"form-group mb-15"}>
                <div className="form-sub-title">{inputHint}</div>
            </div>
        }
    </>
);

export default NumericInput;
