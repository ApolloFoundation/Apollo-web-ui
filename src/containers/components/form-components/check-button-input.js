import React from 'react';
import {Checkbox} from 'react-form';

export const CheckboxFormInput = (props) => {
    const {checkboxes, label, idGroup, setValue} = props;

    return (
        <div className="row form-group-grey">
            {
                label &&
                <div className={`col-md-3 pl-0`}>
                    <span>{label}</span>
                </div>
            }
            
            <div className={`col-md-9 ${label ? '' : 'offset-md-3'}`}>
                {
                    checkboxes &&
                    checkboxes.map((el, index) => {
                        return (
                            <div className="form-check custom-checkbox mb-15" key={index}>
                                <Checkbox className="form-check-input custom-control-input"
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (setValue) setValue(el.field, e);
                                        if (el.handler) el.handler(e);
                                    }}
                                    defaultValue={el.defaultValue || false}
                                    field={el.field}
                                    id={`${idGroup}-${el.field}-field`}
                                />
                                <label 
                                    htmlFor={`${idGroup}-${el.field}-field`}
                                    className="form-check-label custom-control-label pl-3"
                                >
                                    {el.label}
                                </label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}