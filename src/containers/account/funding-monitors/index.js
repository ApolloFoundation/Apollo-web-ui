import React from 'react';
import SiteHeader from '../../components/site-header'

class FundingMonitors extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Funding monitors'}
                />
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        <div className="info-box danger">
                            <p>Incorrect &quot;adminPassword&quot; (locked for 1 hour, too many incorrect password attempts)</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FundingMonitors;