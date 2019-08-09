/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {Creatable} from 'react-select';

import './Multiselect.scss'

const MultiSelect = ({value, placeholder, isClearable, onChange, options, label}) => {
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
            onChange={onChange}
            options={options}
        />
    </>
    );
}

export default MultiSelect;