import React from 'react';
import classNames from 'classnames';

export const ButtonsBlock = ({
  cancelMessage,
  cancelAction,
  submitMessage,
  isPending,
}) => (
  <div className="btn-box right-conner align-right form-footer">
    <button
        type='button'
        onClick={cancelAction}
        className="btn btn-default mr-3"
    >
      {cancelMessage}
    </button>
    <button
        type="submit"
        name='closeModal'
        className={classNames({
            "btn btn-green submit-button": true,
            "loading btn-green-disabled": isPending,
        })}
    >
        <div className="button-loader">
            <div className="ball-pulse">
                <div/>
                <div/>
                <div/>
            </div>
        </div>
        <span className='button-text'>{submitMessage}</span>
    </button>
  </div>
)