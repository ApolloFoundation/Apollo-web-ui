import React from 'react';
import CustomSelect from '../../components/select';

const CustomFormSelect = (props) => {
    const {defaultValue, placeholder, setValue, options, label, field, onChange} = props;

    return (
        <div className="form-group mb-15">
            <label>
                {label}
            </label>
            <div>
                <div className="form-group-select">
                    <CustomSelect
                        className="form-control"
                        field={field}
                        defaultValue={defaultValue}
                        setValue={setValue}
                        placeholder={placeholder}
                        options={options}
                        onChange={(e) => {
                                if (onChange) {
                                    onChange(e)
                                }
                            }
                        }
                    />
                </div>
            </div>
        </div>
    ) 
}

export default CustomFormSelect;