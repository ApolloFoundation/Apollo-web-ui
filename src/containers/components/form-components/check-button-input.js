import React from 'react';
import {Checkbox} from 'react-form';

export const CheckboxFormInput = (props) => {
    const {checkboxes, label, idGroup} = props;

    return (
        <div className={'mb-15'}>
            {label && (
                <label>{label}</label>
            )}

            {
                checkboxes &&
                checkboxes.map((el, index) => {
                    return (
                        <div className={'checkbox-group'} key={index}>
                            <Checkbox
                                className={'lighten'}
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
                            >
                                {el.label}
                            </label>
                        </div>
                    )
                })
            }
        </div>
    )
};