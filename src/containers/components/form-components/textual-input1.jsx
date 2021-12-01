import React from 'react';
import CustomInput from '../custom-input';

const TextualInputComponent = ({
  disabled, hendler, placeholder, name, type,
  label, code, text, className, idGroup, inputHint, id, minValue,
}) => (
  <>
    {type === 'button'
      ? (
        <>
          <div className="form-group mb-15">
            <div>
              <button
                type="button"
                id={idGroup ?? id}
                onClick={hendler}
                className="no-margin btn btn-green"
              >
                {label}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`form-group mb-15 ${className}`}>
            <div className={code && 'input-group'}>
              {!text
                ? (
                  <>
                    <CustomInput
                      disabled={disabled}
                      label={label}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      id={idGroup ?? id}
                      minValue={minValue}
                    />
                    {code && (
                      <div className="input-group-append">
                        <span className="input-group-text">{code}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <span>
                    {text}
                  </span>
                )}
            </div>
          </div>
          {inputHint && (
            <div className="form-group mb-15">
              <div className="row w-100">
                <div className="pl-4 form-sub-title no-margin d-block">{inputHint}</div>
              </div>
            </div>
          )}
        </>
      )}
  </>
);

export default TextualInputComponent;
