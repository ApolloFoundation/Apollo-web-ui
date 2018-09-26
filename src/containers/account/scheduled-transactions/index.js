/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


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
                        <div className="info-box info">
                            <p>Incorrect "adminPassword" (locked, too many incorrect password attempts)</p>
                        </div>
                        <div className="approval-request white-space">
                            <div className="alert">No current approval requests.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScheduledTransactions;