/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import SiteHeader from  '../../components/site-header';
import {getpollsAction} from "../../../actions/polls";
import { TableLoader } from '../../components/TableLoader';
import FinishedpollsItem from "./finished-pools-item";

const Finishedpolls = () => {
    const dispatch = useDispatch();

    const getFinishedpolls =  useCallback(async ({ firstIndex, lastIndex }) => {
        const finishedpolls = await dispatch(getpollsAction({
            firstIndex,
            lastIndex,
            finishedOnly: true,
        }));

        return finishedpolls?.polls ?? [];
    }, [dispatch]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Finished Polls' />
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
                            name: 'Actions',
                            alignRight: true
                        }
                    ]}
                    className='no-min-height mb-3'
                    emptyMessage='No finished polls.'
                    TableRowComponent={FinishedpollsItem}
                    dataLoaderCallback={getFinishedpolls}
                />
            </div>
        </div>
    );
}

export default Finishedpolls;
