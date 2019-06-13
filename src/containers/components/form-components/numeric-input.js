import React from 'react';
import InputForm from '../input-form';

const NumericInput = ({values, label, field, countingTtile, counterLabel, setValue, placeholder, type, idGroup,
                          inputHint, defaultValue, onChange, disabled}) => (
    <>
        <div className="form-group mb-15">
            <label>
                {label}
            </label>
            <div className={(countingTtile || counterLabel) ? "input-group" : ""}>
                <InputForm
                    field={field}
                    placeholder={placeholder}
                    type={type || 'float'}
                    setValue={setValue}
                    defaultValue={defaultValue || ''}
                    id={`${idGroup}${field}-field`}
                    onChange={onChange}
                    disabled={disabled}
                />
                {(countingTtile || counterLabel) && (
                    <div className="input-group-append">
                        <span className="input-group-text">{countingTtile || counterLabel}</span>
                    </div>
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