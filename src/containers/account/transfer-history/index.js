import React from 'react';
import SiteHeader from '../../components/site-header'

class ScheduledTransactions extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Scheduled transactions'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="approval-request white-space">
                            <div className="alert">No transfer history available.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScheduledTransactions;