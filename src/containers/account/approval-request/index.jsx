/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useDispatch, useSelector} from "react-redux";
import SiteHeader from 'containers/components/site-header'
import { TableLoader } from 'containers/components/TableLoader';
import {getApprovesAction} from "actions/approval-requests";
import { getAccountSelector } from 'selectors';
import Transaction from "./transaction";

const ApprovalRequests = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);

    const getApproves = useCallback(async ({ firstIndex, lastIndex }) => {
        const approves = await dispatch(getApprovesAction({
            account,
            firstIndex,
            lastIndex
        }));
        return approves?.transactions ?? [];
    }, [account, dispatch]);

    return (
        <div className="page-content">
            <SiteHeader pageTitle='Approval requests (account)' />
            <div className="page-body container-fluid">
                <TableLoader
                    headersList={[
                        {
                            name: 'Date',
                            alignRight: false
                        },{
                            name: 'Type',
                            alignRight: true
                        },{
                            name: 'Amount',
                            alignRight: true
                        },{
                            name: 'Fee',
                            alignRight: false
                        },{
                            name: 'Account',
                            alignRight: true
                        },{
                            name: 'Judges',
                            alignRight: false
                        },{
                            name: 'Height',
                            alignRight: false
                        },{
                            name: 'Confirmations',
                            alignRight: false
                        },{
                            name: 'Actions',
                            alignRight: false
                        }
                    ]}
                    className='mb-3'
                    emptyMessage='No approval requests found.'
                    TableRowComponent={Transaction}
                    dataLoaderCallback={getApproves}
                />
            </div>
        </div>
    );
}

export default ApprovalRequests;
