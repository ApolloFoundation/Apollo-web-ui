import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import classNames from 'classnames';
import { NavLink } from "react-router-dom";
import { useDataLoader } from "hooks/useDataLoader";
import { getDataTagsAction } from "actions/datastorage";

export const DatastoregeTags = () => {
  const dispatch = useDispatch();
  
  const handleDataLoad = useCallback(async ({ firstIndex, lastIndex }) => {
    const allTaggedData = await dispatch(getDataTagsAction({ firstIndex, lastIndex }));
    return allTaggedData?.tags ?? [];
  }, [dispatch]);

  const {
    data,
    onNextPage,
    onPrevPage,
    isDisabledNext,
    isDisabledPrev,
    firstCount,
    lastCount
  } = useDataLoader(handleDataLoad, 2);

  return (
    <div className="transactions-filters">
        <div className='top-bar'>
            {(data && Boolean(data.length)) && (
                <>
                    {data.map((el) => (
                        <NavLink
                            key={el.tag}
                            to={`/data-storage/tag=${el.tag}`}
                            className='btn filter'
                            activeClassName='active'
                        >
                            {el.tag} [{el.count}]
                        </NavLink>
                    ))}
                </>
            )}
            <div className="btn-box pagination">
                <button
                    type='button'
                    className={classNames({
                        'btn btn-default': true,
                        'disabled': isDisabledPrev,
                    })}
                    onClick={onPrevPage}
                >
                    Previous
                </button>
                <div className='pagination-nav'>
                    <span>{firstCount}</span>
                    <span>&hellip;</span>
                    <span>{lastCount}</span>
                </div>
                <button
                    type='button'
                    onClick={onNextPage}
                    className={classNames({
                        'btn btn-default': true,
                        'disabled': isDisabledNext,
                    })}
                >
                    Next
                </button>
            </div>
        </div>
    </div>
  );
}