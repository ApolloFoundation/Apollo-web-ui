import React from 'react';
import SiteHeader from '../../components/site-header'

class TradeHistory extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Trade history'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="approval-request white-space">
                            <div className="alert">No trade history available.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TradeHistory;