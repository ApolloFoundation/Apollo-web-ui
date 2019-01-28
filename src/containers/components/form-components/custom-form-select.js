import React from 'react';
import CustomSelect from '../../components/select';

export const CustomFormSelect = (props) => {
    const {defaultValue, setValue, options, label, field} = props;

    return (
        <div className="form-group row form-group-grey mb-15">
            <label className="col-sm-3 col-form-label">
                {label}
            </label>
            <div className="col-sm-9 mb-0">
                <div className="form-group-select">
                    <CustomSelect
                        className="form-control"
                        field={field}
                        defaultValue={defaultValue}
                        setValue={setValue}
                        options={options}
                    />
                </div>
            </div>
        </div>
    ) 
}