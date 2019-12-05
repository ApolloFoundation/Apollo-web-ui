import React, { Component } from 'react';
import {Async} from 'react-select';

const AutoComplete = ({loadOptions, placeholder, label, onChange}) => {
    return (
        <>
            <label className='form-group mb-15'>{label}</label>
            <Async  
                cacheOptions
                loadOptions={loadOptions}
                placeholder={placeholder}
                onChange={onChange}
                className={'form-custom-select'}
                classNamePrefix={'custom-select-box'}
            />
        </>
    );
}

export default AutoComplete