import React from 'react';
import InputForm from '../input-form'

const TextualInputComponent = ({setValue, hendler, placeholder, field, type, label, code, text, className, idGroup, inputHint}) => {

    return (
        <>
            {
                type === 'button' ?
                <>
                    <div class="form-group-grey row mb-15">
                        <div class="col-sm-9 offset-sm-3">
                            <a 
                                id={idGroup}
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
                                        id={`${idGroup}${field}-field`}
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
                    {
                        inputHint &&
                        <div className={"form-group row form-group-white mb-15"}>   
                            <div className={"row w-100"}>
                                <div className="col-md-9 offset-sm-0 offset-md-3">
                                    <div class="pl-4 form-sub-title no-margin d-block">{inputHint}</div>
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default TextualInputComponent;