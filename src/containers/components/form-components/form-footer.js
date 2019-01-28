import React from 'react';
import classNames from 'classnames';

const FormFooter = ({submitButtonName, isAdvanced, isPending, isDisabled, setValue, closeModal}) => (
    <div className="btn-box align-buttons-inside absolute right-conner align-right form-footer">
        <a
            onClick={() => closeModal()}
            className={`btn round round-top-left ${submitButtonName ? '' : 'round-bottom-right' }`}
        >
            Cancel
        </a>
        {
            submitButtonName &&
            <button
                type="submit"
                name={'closeModal'}
                className={classNames({
                    "btn" : true,
                    "btn-right" : true,
                    "blue" : true,
                    "round" : true,
                    "submit-button" : true,
                    "round-bottom-right" : true,
                    "blue-disabled": isDisabled
                })}
            >
                {
                    isPending ?  
                    <div
                        className="button-loader"
                    >
                        <div className="ball-pulse">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div> :
                    <span className={'button-text'}>
                        {submitButtonName}
                    </span> 
                }            
            </button>
        }
    </div>
)

export default FormFooter;