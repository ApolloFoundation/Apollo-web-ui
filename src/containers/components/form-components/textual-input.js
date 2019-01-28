import React from 'react';
import InputForm from '../input-form'

const TextualInputComponent = ({setValue, placeholder, field, type, label, code, text}) => {

    return (
        <div className="form-group row form-group-white mb-15">
            <label className="col-sm-3 col-form-label">
                {label}
            </label>
            <div className="col-sm-9 input-group input-group-text-transparent">
                {
                    !text ?
                    <>
                        <InputForm
                            type={type}
                            field={field}
                            placeholder={placeholder}
                            setValue={setValue}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">{code}</span>
                        </div>
                    </> : 
                    <span>
                        {text}
                    </span>
                }
                
            </div>
        </div>
    )
}

export default TextualInputComponent;