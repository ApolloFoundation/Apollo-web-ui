/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch} from 'react-redux';
import SiteHeader from '../../components/site-header';
import {getpollsAction} from '../../../actions/polls';
import PoolItem from './pool-item';
import { TableLoader } from '../../components/TableLoader';

const Activepolls  = () => {
    const dispatch = useDispatch();

    const getActivePolls = useCallback(async ({ firstIndex, lastIndex }) => {
        const activepolls = await dispatch(getpollsAction({
            firstIndex,
            lastIndex,
            includeFinished: false,
        }));
        return activepolls?.polls ?? []; 
    }, [dispatch]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Active polls' />
            <div className="page-body container-fluid">
                <TableLoader
                    headersList={[
                        {
                            name: 'Title',
                            alignRight: false
                        }, {
                            name: 'Description',
                            alignRight: false
                        }, {
                            name: 'Sender',
                            alignRight: false
                        }, {
                            name: 'Start date',
                            alignRight: false
                        }, {
                            name: 'Blocks left',
                            alignRight: false
                        }, {
                            name: 'Actions',
                            alignRight: true
                        }
                    ]}
                    className='no-min-height mb-3'
                    emptyMessage='No active polls.'
                    TableRowComponent={PoolItem}
                    dataLoaderCallback={getActivePolls}
                />
            </div>
        </div>
    );
}

export default Activepolls;
