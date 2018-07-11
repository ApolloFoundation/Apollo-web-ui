import React from 'react';
import SiteHeader from '../../components/site-header'

class OpenOrders extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Open orders'}
                />
                <div className="page-body container-fluid">
                    <div className="open-orders">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="approval-request white-space">
                                    <div className="alert">No assets.</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="approval-request white-space">
                                    <div className="alert">No assets.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default OpenOrders;