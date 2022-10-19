import React from 'react';
import classNames from 'classnames';

export const Pagination = ({ 
  isPrevDisabled,
  isNextDisabled,
  firstIndex,
  lastIndex,
  onPrevPage,
  onNextPage,
}) => (
  <div className="btn-box pagination">
    <button
      type='button'
      className={classNames('btn btn-default', {
        'disabled': isPrevDisabled,
      })}
      onClick={onPrevPage}
    >
      Previous
    </button>
    <div className='pagination-nav'>
      <span>{firstIndex}</span>
      <span>&hellip;</span>
      <span>{lastIndex}</span>
    </div>
    <button
      type='button'
      onClick={onNextPage}
      className={classNames('btn btn-default', {
        'disabled': isNextDisabled
      })}
    >
      Next
    </button>
  </div>
);