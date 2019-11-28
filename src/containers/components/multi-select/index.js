/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {Creatable} from 'react-select';

import './Multiselect.scss'

const MultiSelect = ({value, placeholder, isClearable, onChange, options, label, setValue, field}) => {
    const handleChange = value => {
        onChange(value);
        if(setValue && field) setValue(field, value)
    }
    return (
        <>
            <label className='form-group mb-15'>{label}</label>
            <Creatable
                isMulti
                className={'form-custom-select'}
                classNamePrefix={'custom-select-box'}
                placeholder={placeholder}
                isClearable={isClearable}
                value={value}
                onChange={handleChange}
                options={options}
            />
        </>
    );
}

export default MultiSelect;