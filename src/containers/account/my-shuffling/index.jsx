/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SiteHeader from 'containers/components/site-header';
import { TableLoader } from 'containers/components/TableLoader';
import {getAccountShufflingsAction} from 'actions/shuffling';
import {getTransactionAction} from 'actions/transactions';
import {setBodyModalParamsAction} from 'modules/modals';
import { getAccountSelector } from 'selectors';
import ShufflingItem from './shuffling-item'

const MyShufling = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);

    const getAccountShufflings = useCallback(async ({ firstIndex, lastIndex }) => {
        const {shufflings} = await dispatch(getAccountShufflingsAction({
            account,
            firstIndex,
            lastIndex,
        }));
        return shufflings ?? [];
    }, [dispatch, account]);

    const getTransaction = useCallback(async (transaction) => {
        const res = await dispatch(getTransactionAction({
            transaction,
            account,
        }));
        if (res) {
            dispatch(setBodyModalParamsAction('INFO_TRANSACTION', res));
        }
    }, [dispatch, account]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='My shuffling' />
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
                        }
                    ]}
                    className='no-min-height mb-3'
                    emptyMessage='No shufflings found.'
                    TableRowComponent={ShufflingItem}
                    passProps={{ getTransaction }}
                    dataLoaderCallback={getAccountShufflings}
                />
            </div>
        </div>
    );
}

export default MyShufling;
