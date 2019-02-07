import React from 'react';
import {TextArea} from 'react-form';

const CustomTextArea = ({label, field, placeholder, note, className, idGroup}) => (
    <div className={`form-group row form-group-white mb-15 ${className}`}>
        <label className="col-sm-3 col-form-label align-self-start">
            {label}
        </label>
        <div className="col-sm-9">
            <TextArea 
                className="form-control"
                placeholder={placeholder}
                field={field}
                cols="30" rows="5"
                id={`${idGroup}${field}-field`}
            />
            {
                note &&
                <div class="form-sub-title align-margin-top align-left">
                    {note}
                </div>
            }
        </div>
    </div>
)

export default CustomTextArea;