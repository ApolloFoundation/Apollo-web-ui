import React from 'react';

const FormRowText = ({label, text}) => {
    return (
        <div className="form-group row form-group-white mb-15">
            {
                label &&
                <label className="col-sm-3 col-form-label">
                    {label}
                </label>
            }
            
            <div className={`col-sm-${label ? '9' : '12 p-0' }`}>
                <span>
                    {text}
                </span>
            </div>
        </div>
    )
}

export default FormRowText;