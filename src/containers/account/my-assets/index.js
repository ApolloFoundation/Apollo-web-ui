import React from 'react';
import SiteHeader from '../../components/site-header'

class MyAssets extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="approval-request white-space">
                            <div className="alert">No assets.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyAssets;