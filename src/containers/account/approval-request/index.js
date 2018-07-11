import React from 'react';
import SiteHeader from '../../components/site-header'

class ApprovalRequests extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Approval requests (account)'}
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

export default ApprovalRequests;