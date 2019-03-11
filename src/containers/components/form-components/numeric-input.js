import React from 'react';
import InputForm from '../input-form';

const NumericInput = ({label, field, countingTtile, setValue, placeholder, type, idGroup, inputHint}) => (
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
            <div className={"form-group row form-group-white mb-15"}>   
                <div className={"row w-100"}>
                    <div className="col-md-9 offset-sm-0 offset-md-3">
                        <div class="pl-4 form-sub-title no-margin d-block">{inputHint}</div>
                    </div>
                </div>
            </div>
        }
    </>
    
)

export default NumericInput;