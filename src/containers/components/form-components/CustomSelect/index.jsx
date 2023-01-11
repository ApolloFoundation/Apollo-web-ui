import React from 'react';
import CustomSelect from '../../select/index1';

const CustomFormSelect = ({ defaultValue, options, label, name }) => (
    <div className="form-group mb-15">
        <label>
            {label}
        </label>
        <div>
            <div className="form-group-select">
                <CustomSelect
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
