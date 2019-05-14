import React from 'react';
import InputForm from '../input-form';

const NumericInput = ({values, label, field, countingTtile, setValue, placeholder, type, idGroup, inputHint, defaultValue}) => (
    <>
        <div className="form-group mb-15">
            <label>
                {label}
            </label>
            <div className="input-group">
                <InputForm
                    field={field}
                    placeholder={placeholder}
                    type={'float'}
                    setValue={setValue}
                    defaultValue={defaultValue}
                    id={`${idGroup}${field}-field`}
                />
                <div className="input-group-append">
                    <span className="input-group-text">
                        {countingTtile}
                    </span>
                </div>
            </div>
        </div>
        {
            inputHint &&
            <div className={"form-group row mb-15"}>
                <div className={"row w-100"}>
                    <div className="pl-4 form-sub-title no-margin d-block">{inputHint}</div>
                </div>
            </div>
        }
    </>
);

export default NumericInput;