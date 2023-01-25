/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import SiteHeader from "../../components/site-header";
import ShufflingItem from './../active-shufflings/shuffling-item';
import {getFinishedShfflings} from '../../../actions/shuffling';
import { TableLoader } from '../../components/TableLoader';

const FinishedShufflings = () => {
    const dispatch = useDispatch();
    const getFinishedShfflingsRequest =  useCallback(async ({ firstIndex, lastIndex }) => {
        const finishedShufflings = await dispatch(getFinishedShfflings({
            firstIndex,
            lastIndex,
        }));
        return finishedShufflings?.shufflings ?? [];
    }, [dispatch]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Finished Shuffling' />
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
                            name: 'Participants',
                            alignRight: true
                        }, {
                            name: 'Issuer',
                            alignRight: true
                        }
                    ]}
                    className='no-min-height mb-3'
                    emptyMessage='No finished shuffling.'
                    TableRowComponent={ShufflingItem}
                    dataLoaderCallback={getFinishedShfflingsRequest}
                />
            </div>
        </div>
    );
}

export default FinishedShufflings;