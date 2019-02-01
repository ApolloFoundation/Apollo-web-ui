import React from 'react';
import CustomSelect from '../../components/select';

const CustomFormSelect = (props) => {
    const {defaultValue, setValue, options, label, field, onChange} = props;

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