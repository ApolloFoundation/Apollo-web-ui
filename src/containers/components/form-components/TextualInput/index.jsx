import React from 'react';
import classNames from 'classnames';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import styles from './index.module.scss';

const TextualInputComponent = ({
  disabled, hendler, placeholder, name, type,
  label, code, text, className, idGroup, inputHint,
}) => (
  <>
    {type === 'button'
      ? (
        <>
          <div className="form-group mb-15">
            <div>
              <button
                type="button"
                id={idGroup}
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
          <div className={classNames('form-group mb-15', className)}>
            <div className={classNames({ 'input-group': code })}>
              {!text
                ? (
                  <>
                    <CustomInput
                      disabled={disabled}
                      label={label}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      id={`${idGroup}${name}-field`}
                    >
                      {code && (
                        <div className="input-group-append">
                          <span className="input-group-text">{code}</span>
                        </div>
                      )}
                    </CustomInput>
                  </>
                ) : (
                  <div className={styles.message}>
                    <label>
                        {label}
                    </label>
                    <span>
                      {text}
                    </span>
                  </div>  
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
