import React from 'react';
import InputForm from '../input-form';

const NumericInputComponent = ({setValue, value, countLabel, defaultValue, label, field, placeholder, type, disabled}) => (
    <div className="form-group row form-group-white mb-15">
        <label className="col-sm-3 col-form-label">
            {label}
        </label>
        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
            <InputForm
                defaultValue={defaultValue}
                field={field}
                placeholder={placeholder}
                type={type}
                value={value}
                setValue={setValue}
                disabled={disabled}
            />
            <div className="input-group-append">
                <span className="input-group-text">{countLabel}</span>
            </div>
        </div>
    </div>
)

export default NumericInputComponent;