import React from 'react';
import { SelectWithFormik } from 'containers/components/select/SelectWithFormik';

const CustomFormSelect = ({ defaultValue, options, label, name }) => (
    <div className="form-group mb-15">
        <label>
            {label}
        </label>
        <div>
            <div className="form-group-select">
                <SelectWithFormik
                    className="form-control"
                    name={name}
                    defaultValue={defaultValue}
                    options={options}
                />
            </div>
        </div>
    </div>
);

export default CustomFormSelect;
