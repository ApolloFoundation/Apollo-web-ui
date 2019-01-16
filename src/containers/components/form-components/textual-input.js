import React from 'react';
import InputForm from '../input-form';

const TextualInputComponent = ({setValue, defaultValue, label, field, placeholder, disabled}) => (
    <div className="form-group row form-group-grey mb-15">
        <label className="col-sm-3 col-form-label">
            {label}
        </label>
        <div className="col-sm-9 mb-0">
            <InputForm
                disabled={disabled}
                defaultValue={defaultValue}
                field={field}
                placeholder={placeholder}
                setValue={setValue}/>
        </div>
    </div>
)

export default TextualInputComponent;