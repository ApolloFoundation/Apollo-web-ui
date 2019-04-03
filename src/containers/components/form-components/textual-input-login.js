import React from 'react';
import InputForm from '../input-form'

const TextualInputLoginComponent = ({setValue, hendler, placeholder, field, type, label, code, text, className, idGroup, inputHint}) => {
    return (
        <div className={'d-flex flex-column'}>
            <label>
                {label}
            </label>
            <div className="input-group input-group-text-transparent">
                <InputForm
                    type={type}
                    field={field}
                    placeholder={placeholder}
                    setValue={setValue}
                    id={`${idGroup}${field}-field`}
                />
            </div>
        </div>
    )
};

export default TextualInputLoginComponent;