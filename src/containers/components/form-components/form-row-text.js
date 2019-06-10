import React from 'react';

const FormRowText = ({label, text}) => {
    return (
        <div className="form-group mb-15">
            {label && (
                <label>
                    {label}
                </label>
            )}
            <div>
                <span>
                    {text}
                </span>
            </div>
        </div>
    )
};

export default FormRowText;