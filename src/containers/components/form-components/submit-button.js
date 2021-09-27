import React from 'react';


export const SubmitFormButton = (props) => {

    return (
        <button
            type="submit"
            name={'closeModal'}
            className={`btn btn-right submit-button blue round round-bottom-right ${props.loading ? 'loading' : ''}`}
        >
            <span className='button-text'>
                {props.text}
            </span>
            <div className="button-loader">
                <div className="ball-pulse">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </button>
    )
}
