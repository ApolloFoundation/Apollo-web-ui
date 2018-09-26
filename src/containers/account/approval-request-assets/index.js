/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'

class ApprovalRequestsAssets extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Approval requests'}
                />
                <div className="page-body container-fluid">
                    <div className="approval-request white-space">
                        <div className="alert">No current approval requests.</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ApprovalRequestsAssets;