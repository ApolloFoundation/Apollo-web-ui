import React from 'react';
import SiteHeader from '../../components/site-header'

class Plugins extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Plugins'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="approval-request white-space">
                            <div className="alert">0 Plugins active and running. <span
                                className="blue">Status page.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Plugins;