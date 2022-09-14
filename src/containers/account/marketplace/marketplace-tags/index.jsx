import React, {useEffect, useState, useCallback} from 'react';
import classNames from 'classnames';
import {Form, Text} from 'react-form';
import {useDispatch} from 'react-redux';
import {NotificationManager} from "react-notifications";
import {Link, useHistory} from 'react-router-dom';
import {getDGSTagsAction,} from '../../../../actions/marketplace'
import AccountRS from "../../../components/account-rs";

const MarketplaceTags = ({ showMoreController, isShowMore }) => {
    const dispatch =  useDispatch();
    const history = useHistory();
    const [state, setState] = useState({
        itemsPerPage: 10,
        itemsPerPageMore: 32,
        getDGSTags: [],
        page: 1,
        firstIndex: 0,
        lastIndex: 32,
        itemsPerPage: 32 + 1
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

    const handleSearchByTag = (values) => {
        if (values.tag) {
            history.push(`/marketplace/${values.tag}`);
        }
    };

    const handleSearchByAccount = (values) => {
        if (values && values.seller) {
            if (!values.seller.includes("_")) {
                history.push(`/marketplace/${values.seller}`);
            } else {
                NotificationManager.error('The account ID is incorrect.', 'Error', 5000);
            }
        }
    };

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
                            <Form
                                onSubmit={handleSearchByAccount}
                                render={({
                                            submitForm, values, addValue, removeValue, setValue, getFormState
                                        }) => (
                                        <form
                                            className="iconned-input-field"
                                            onSubmit={submitForm}
                                        >
                                            <AccountRS
                                                field='seller'
                                                setValue={setValue}
                                                noContactList
                                                placeholder="Seller's Account ID"
                                            />
                                            <button className="search-icon">
                                                <i className="zmdi zmdi-search" />
                                            </button>
                                        </form>
                                    )}
                            />

                        </div>
                    </div>
                    <div className={classNames({
                        'col-md-12 pr-0 pl-0' : !isShowMore,
                        'col-md-6 pr-0 pl-0' : isShowMore
                    })}>
                        <div className="input-group-app search tabled">
                            <Form
                                onSubmit={handleSearchByTag}
                                render={({ submitForm }) => (
                                    <form
                                        className="iconned-input-field"
                                        onSubmit={submitForm}
                                    >
                                        <Text field="tag" placeholder="Title, description or Tag" />

                                        <button className="search-icon">
                                            <i className="zmdi zmdi-search" />
                                        </button>
                                    </form>
                                )}
                            />
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
                    <div className="btn-box pagination">
                        <button
                            type='button'
                            className={classNames({
                                'btn btn-default': true,
                                'disabled': state.page <= 1,
                            })}
                            onClick={handlePaginate(state.page - 1)}
                        >
                            Previous
                        </button>
                        <div className='pagination-nav'>
                            <span>{state.page * state.itemsPerPageMore - state.itemsPerPageMore + 1}</span>
                            <span>&hellip;</span>
                            <span>{(state.page * state.itemsPerPageMore - state.itemsPerPageMore - 1) + state.getDGSTags.length}</span>
                        </div>
                        <button
                            type='button'
                            onClick={handlePaginate(state.page + 1)}
                            className={classNames({
                                'btn btn-default': true,
                                'disabled': isNextDisabled()
                            })}
                        >
                            Next
                        </button>
                    </div>
                    )}
            </div>
        </div>
    );
}

export default MarketplaceTags;
