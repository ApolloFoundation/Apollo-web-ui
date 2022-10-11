import React from 'react';
import classNames from 'classnames';

export const Pagination = ({ 
  page,
  onPaginate,
  itemsPerPage,
  isNextDisabled,
  data,
}) => (
  <div className="btn-box pagination">
    <button
      type='button'
      className={classNames('btn btn-default', {
        'disabled': page <= 1,
      })}
      onClick={onPaginate(page - 1)}
    >
      Previous
    </button>
    <div className='pagination-nav'>
      <span>{page * itemsPerPage - itemsPerPage + 1}</span>
      <span>&hellip;</span>
      <span>{(page * itemsPerPage - itemsPerPage - 1) + (data?.length ?? 1)}</span>
    </div>
    <button
      type='button'
      onClick={onPaginate(page + 1)}
      className={classNames('btn btn-default', {
        'disabled': isNextDisabled
      })}
    >
      Next
    </button>
  </div>
);