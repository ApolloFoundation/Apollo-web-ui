/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SiteHeader from 'containers/components/site-header'
import {getMyVotesAction, getVoteAction} from 'actions/polls';
import {setBodyModalParamsAction} from "modules/modals";
import { getAccountSelector } from 'selectors';
import { TableLoader } from 'containers/components/TableLoader';
import PoolItem from '../active-polls/pool-item';

const MyVotes = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);

    const getMyVotes = useCallback(async ({firstIndex, lastIndex}) => {
        const myVotes = await dispatch(getMyVotesAction({
            firstIndex,
            lastIndex,
            account,
        }));

        if (myVotes && myVotes.transactions) {
            const promiseList = myVotes.transactions.map((el) => getVote({
                poll: el.attachment.poll,
            }));    
            let polls = await Promise.all(promiseList);
            return polls ?? []
        }
        return [];
    }, []);

    const getVote = useCallback(async (reqParams) => await dispatch(getVoteAction(reqParams)), [dispatch]);

    const handleIssuePoll = () => dispatch(setBodyModalParamsAction('ISSUE_POLL', {}));

    return (
        <div className="page-content">
            <SiteHeader pageTitle='My Votes'>
                <button
                    type='button'
                    className="btn btn-green btn-sm"
                    style={{marginLeft: 15}}
                    onClick={handleIssuePoll}
                >
                    Create Poll
                </button>
            </SiteHeader>
            <div className="page-body container-fluid">
                <TableLoader
                    headersList={[
                        {
                            name: 'Title',
                            alignRight: false
                        },{
                            name: 'Description',
                            alignRight: false
                        },{
                            name: 'Sender',
                            alignRight: false
                        },{
                            name: 'Start date',
                            alignRight: false
                        },{
                            name: 'Blocks left',
                            alignRight: false
                        },{
                            name: 'Actions',
                            alignRight: true
                        }
                    ]}
                    emptyMessage='No votes found.'
                    className='mb-3'
                    TableRowComponent={PoolItem}
                    itemsPerPage={9}
                    dataLoaderCallback={getMyVotes}
                />
            </div>
        </div>
    );
}

export default MyVotes;
