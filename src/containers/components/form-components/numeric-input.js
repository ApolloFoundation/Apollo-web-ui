import React from 'react';
import InputForm from '../input-form';

const NumericInput = ({values, label, field, countingTtile, counterLabel, setValue, placeholder, type, idGroup, inputHint, defaultValue}) => (
    <>
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
                    defaultValue={defaultValue}
                    id={`${idGroup}${field}-field`}
                />
                {(countingTtile || counterLabel) && (
                    <div className="input-group-append">
                    <span className="input-group-text">
                        {countingTtile || counterLabel}
                    </span>
                    </div>
                )}
            </div>
        </div>
        {inputHint && (
            <div className={"form-group row form-group-white mb-15"}>
                <div className={"row w-100"}>
                    <div className="col-md-9 offset-sm-0 offset-md-3">
                        <div className="pl-4 form-sub-title no-margin d-block">{inputHint}</div>
                    </div>
                </div>
            </div>
        )}
    </>
    
)

export default NumericInput;