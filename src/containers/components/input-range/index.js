import React from 'react';
import {Field} from 'react-form';

const InputRange = props => (
    <Field field={props.field}>
        {fieldApi => {
            const {onChange, onBlur, field, disabled, ...rest} = props;
            const {value, setValue, setTouched} = fieldApi;
            return (
                <div className={'range-wrap mb-3'}>
                    <div
                        className={`range-value ${disabled ? 'disabled' : ''}`}
                        style={{left: `calc((100% - 30px) * ${value} / 100)`}}
                    >
                        {value || rest.min}%
                    </div>
                    <input
                        {...rest}
                        value={value || rest.min}
                        onChange={e => {
                            setValue(e.target.value);
                            if (onChange) {
                                onChange(e.target.value, e)
                            }
                        }}
                        onBlur={e => {
                            setTouched();
                            if (onBlur) {
                                onBlur(e)
                            }
                        }}
                        className={'input-range'}
                        type="range"
                        min={rest.min}
                        max={rest.max}
                        disabled={disabled}
                    />
                </div>
            )
        }}
    </Field>
);

export default InputRange;