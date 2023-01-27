/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SiteHeader from 'containers/components/site-header'
import { getMyPollsAction } from 'actions/polls';
import { setBodyModalParamsAction } from "modules/modals";
import { getAccountSelector } from 'selectors';
import { TableLoader } from 'containers/components/TableLoader';
import PoolItem from '../active-polls/pool-item';

const MyVotes = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);

    const getMyPolls = useCallback(async ({ firstIndex, lastIndex }) => {
        const myPolls = await dispatch(getMyPollsAction({
            firstIndex,
            lastIndex,
            account,
            includeFinished: true
        }));

        return myPolls?.polls ?? [];
    }, [dispatch, account]);

    const handleIssuePollModal = () => dispatch(setBodyModalParamsAction('ISSUE_POLL', {}));

    return (
        <div className="page-content">
            <SiteHeader pageTitle='My Polls'>
                <button
                    type='button'
                    className="btn btn-green btn-sm"
                    style={{marginLeft: 15}}
                    onClick={handleIssuePollModal}
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
                    className='no-min-height mb-3'
                    emptyMessage='No polls found.'
                    TableRowComponent={PoolItem}
                    dataLoaderCallback={getMyPolls}
                />
            </div>
        </div>
    );
}

export default MyVotes;
