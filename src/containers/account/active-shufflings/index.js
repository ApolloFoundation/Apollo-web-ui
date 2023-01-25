/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import SiteHeader from "../../components/site-header";
import ShufflingItem from './shuffling-item';
import {getActiveShfflings} from '../../../actions/shuffling';
import { TableLoader } from '../../components/TableLoader';

const ActiveShufflings = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        NotificationManager.info('After creating or joining a shuffling, you must keep your node online and your shuffler running, leaving enough funds in your account to cover the shuffling fees, until the shuffling completes! If you don\'t and miss your turn, you will be fined.', null, 1000000);
    }, []);

    const getActiveShfflingsRequest = useCallback(async ({ firstIndex, lastIndex }) => {
        const activeShuffling = await dispatch(getActiveShfflings({
            firstIndex, lastIndex
        }));
        return activeShuffling?.shufflings ?? [];
    }, [dispatch]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Active Shuffling' />
            <div className="page-body container-fluid">
                <TableLoader
                    headersList={[
                        {
                            name: 'Shuffling',
                            alignRight: false
                        }, {
                            name: 'Stage',
                            alignRight: false
                        }, {
                            name: 'Holding',
                            alignRight: false
                        }, {
                            name: 'Amount',
                            alignRight: false
                        }, {
                            name: 'Blocks Remaining',
                            alignRight: false
                        }, {
                            name: 'Participants',
                            alignRight: true
                        }, {
                            name: 'Assignee',
                            alignRight: true
                        }, {
                            name: 'Status',
                            alignRight: true
                        }
                    ]}
                    className='no-min-height mb-3'
                    emptyMessage='No active shuffling.'
                    TableRowComponent={ShufflingItem}
                    dataLoaderCallback={getActiveShfflingsRequest}
                />
            </div>
        </div>
    );
}

export default ActiveShufflings;
