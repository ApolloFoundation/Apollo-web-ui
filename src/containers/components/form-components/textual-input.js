import React from 'react';
import InputForm from '../input-form'

const TextualInputComponent = ({setValue, hendler, placeholder, field, type, label, code, text, className}) => {

    return (
        <>
            {
                type === 'button' ?
                <>
                    <div class="form-group-grey row mb-15">
                        <div class="col-sm-9 offset-sm-3">
                            <a 
                                onClick={() => hendler()}
                                class="no-margin btn static blue"
                            >
                                {label}
                            </a>
                        </div>
                    </div>
                </> : 
                <>
                    <div className={`form-group row form-group-white mb-15 ${className}`}>
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
                </>
            }
        </>
    )
}

export default TextualInputComponent;