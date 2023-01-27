/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import Creatable from 'react-select/creatable';

import './Multiselect.scss'

const MultiSelect = ({value, placeholder, isClearable, onChange, options, label, name}) => {
    const formik = useFormikContext();

    const handleChange = useCallback(value => {
        onChange(value);
        formik.setFieldValue(name, value)
    }, [onChange, formik.setFieldValue, name]);

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
