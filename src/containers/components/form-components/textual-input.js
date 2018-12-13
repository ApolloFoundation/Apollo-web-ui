import React from 'react';
import InputForm from '../input-form'

export const CustomInputForm = ({setValue, placeholder, field, type, label, code}) => {

    return (
        <div className="form-group row form-group-white mb-15">
            <label className="col-sm-3 col-form-label">
                {label}
            </label>
            <div className="col-sm-9 input-group input-group-text-transparent">
                <InputForm
                    type={type}
                    field={field}
                    placeholder={placeholder}
                    setValue={setValue}/>
                <div className="input-group-append">
                    <span className="input-group-text">{code}</span>
                </div>
            </div>
        </div>
    )
}