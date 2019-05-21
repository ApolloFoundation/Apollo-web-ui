import React from 'react';
import {TextArea} from 'react-form';

const CustomTextArea = ({label, field, placeholder, note, className, idGroup, defaultValue, rows}) => (
    <div className={`form-group mb-15 ${className}`}>
        <label>
            {label}
        </label>
        <div>
            <TextArea
                className="form-control"
                placeholder={placeholder}
                field={field}
                defaultValue={defaultValue}
                cols="30" rows={rows || "5"}
                id={`${idGroup}${field}-field`}
            />
            {note && (
                <div className="form-sub-title align-margin-top align-left">
                    {note}
                </div>
            )}
        </div>
    </div>
);

export default CustomTextArea;