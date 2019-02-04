import React from 'react';
import InputForm from '../input-form';

const NumericInput = ({label, field, countingTtile, setValue, placeholder, type}) => (
    <div className="form-group row form-group-white">
        <label className="col-sm-3 col-form-label">
            {label}
        </label>
        <div className="col-sm-9 input-group input-group-text-transparent input-group-sm">
            <InputForm
                field={field}
                placeholder={placeholder}
                type={'float'}
                setValue={setValue}
            />
            <div className="input-group-append">
                <span className="input-group-text">
                    {countingTtile}
                </span>
            </div>
        </div>
    </div> 
)

export default NumericInput;