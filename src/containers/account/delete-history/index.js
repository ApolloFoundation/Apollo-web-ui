import React from 'react';
import SiteHeader from '../../components/site-header'

class DeleteHistory extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Delete History'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="approval-request white-space">
                            <div className="alert">No delete history available.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DeleteHistory;