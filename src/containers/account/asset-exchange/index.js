import React from 'react';
import SiteHeader from '../../components/site-header'

class AssetExchange extends React.Component {
    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Asset exchange'}
                />
                <div className="page-body container-fluid">
                    <div className="scheduled-transactions">
                        <div className="approval-request white-space">
                            <div className="alert">You don`t have any asst in your bookmark list yet. Click on "Add
                                asset" to add asset.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AssetExchange;