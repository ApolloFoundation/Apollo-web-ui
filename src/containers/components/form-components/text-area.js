import React from 'react';
import {TextArea} from 'react-from';

const CustomTextArea = ({label, field, placeholder}) => (
    <div className="form-group row form-group-white mb-15">
        <label className="col-sm-3 col-form-label align-self-start">
            {label}
        </label>
        <div className="col-sm-9">
            <TextArea 
                className="form-control"
                placeholder={placeholder}
                field={field}
                cols="30" rows="5"
            />
        </div>
    </div>
)

export default CustomTextArea;