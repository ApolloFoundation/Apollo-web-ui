import React, { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDGSTagsAction } from 'actions/marketplace'
import { Pagination } from 'containers/components/pagination';
import { AccountForm } from './AccountForm';
import { TagForm } from './TagForm';

const MarketplaceTags = ({ showMoreController, isShowMore }) => {
    const dispatch =  useDispatch();
    const [state, setState] = useState({
        itemsPerPage: 10,
        itemsPerPageMore: 33,
        getDGSTags: [],
        page: 1,
        firstIndex: 0,
        lastIndex: 32,
        itemsPerPage: 32,
    });

    const getDGSTags = useCallback(async (reqParams) => {
        const getDGSTags = await dispatch(getDGSTagsAction(reqParams));

        if (getDGSTags) {
            setState(prevState => ({
                ...prevState,
                getDGSTags: getDGSTags.tags
            }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (isShowMore) {
            setState(prevState => ({
                ...prevState,
                page: 1,
                firstIndex: 0,
                lastIndex: 32,
            }));
            getDGSTags({
                firstIndex: 0,
                lastIndex: state.itemsPerPageMore,
            })
        } else {
            getDGSTags({
                firstIndex: 0,
                lastIndex: 9,
            })
        }
    }, [isShowMore, getDGSTags]);

    const isNextDisabled = () => !state.getDGSTags[state.itemsPerPageMore];

    const prepareTags = () => {
        const {itemsPerPageMore, getDGSTags = []} = state;
        return getDGSTags.length > itemsPerPageMore ? getDGSTags.slice(0, -1) : getDGSTags;
    }

    const handlePaginate = (page) => () => {
        let reqParams = {
            page: page,
            firstIndex: page * state.itemsPerPageMore - state.itemsPerPageMore,
            lastIndex:  page * state.itemsPerPageMore
        };
        setState(prevState => ({
            ...prevState,
            ...reqParams,
        }));

        getDGSTags(reqParams)
    };

        return (
        <div className="card  marketplace filters transparent">
            <div className="search-bar m-0">
                <div className="row m-0">
                    <div className={classNames({
                        'col-md-12 pr-0 pl-0' : !isShowMore,
                        'col-md-6 pr-0 pl-0' : isShowMore
                    })}>
                        <div className="input-group-app search tabled">
                            <AccountForm />
                        </div>
                    </div>
                    <div className={classNames({
                        'col-md-12 pr-0 pl-0' : !isShowMore,
                        'col-md-6 pr-0 pl-0' : isShowMore
                    })}>
                        <div className="input-group-app search tabled">
                            <TagForm />
                        </div>
                    </div>
                </div>
            </div>
            <div className="filters-bar">
                {
                    prepareTags().map((el) => 
                        <Link key={el.tag} to={'/marketplace/' + el.tag} className="btn filter btn-xs">
                            {el.tag}&nbsp;[{el.totalCount}]
                        </Link>
                    )
                }
                <button
                    type='button'
                    className="btn btn-green btn-xs m-1"
                    onClick={showMoreController}
                >
                    {isShowMore ? 'View less' : 'View more'}
                </button>
                {state.getDGSTags && isShowMore && (
                    <Pagination
                        firstIndex={state.firstIndex + 1}
                        lastIndex={
                            (state.page - 1) * state.itemsPerPageMore + (state.getDGSTags?.length > 0 ? state.getDGSTags?.length : 1)
                        }
                        itemsPerPage={state.itemsPerPageMore}
                        isNextDisabled={isNextDisabled()}
                        isPrevDisabled={state.page === 1}
                        onNextPage={handlePaginate(state.page + 1)}
                        onPrevPage={handlePaginate(state.page - 1)}
                    />
                )}
            </div>
        </div>
    );
}

export default MarketplaceTags;
