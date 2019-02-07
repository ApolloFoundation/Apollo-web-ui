import React from 'react';
import {Checkbox} from 'react-form';
import uuid from 'uuid';

export const CheckboxFormInput = (props) => {
    const {checkboxes, label, idGroup} = props;

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
                    checkboxes.map(el => {
                        return (
                            <div className="form-check custom-checkbox mb-15">
                                <Checkbox className="form-check-input custom-control-input"
                                    type="checkbox"
                                    onChange={() => {
                                        if (el.handler) {
                                            el.handler()
                                        }
                                    }}
                                    defaultValue={el.defaultValue}
                                    field={el.field}
                                    id={`${idGroup}-${el.field}-field`}
                                />
                                <label 
                                    htmlFor={`${idGroup}-${el.field}-field`}
                                    className="form-check-label custom-control-label"
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