import React from 'react';
import InputForm from '../input-form'

const TextualInputComponent = ({setValue, hendler, placeholder, field, type, label, code, text, className, idGroup, inputHint}) => {
    return (
        <>
            {
                type === 'button' ?
                    <>
                        <div className="form-group mb-15">
                            <div>
                                <a
                                    id={idGroup}
                                    onClick={() => hendler()}
                                    className="no-margin btn static blue"
                                >
                                    {label}
                                </a>
                            </div>
                        </div>
                    </> :
                    <>
                        <div className={`form-group mb-15 ${className}`}>
                            <label>
                                {label}
                            </label>
                            <div className="input-group">
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
                            <div className={"form-group mb-15"}>
                                <div className={"row w-100"}>
                                    <div className="pl-4 form-sub-title no-margin d-block">{inputHint}</div>
                                </div>
                            </div>
                        }
                    </>
            }
        </>
    )
};

export default TextualInputComponent;