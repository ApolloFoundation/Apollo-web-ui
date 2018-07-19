import React from 'react';
import SiteHeader from '../../../components/site-header/index';
import MarketplaceItem from '../marketplace-card'
import classNames from "classnames";

import '../MarketPLace.css';

class ResentMarketplaceListing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            market: []
        };
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Recent listing'}
                    showPrivateTransactions={'ledger'}
                />
                <div className="page-body container-fluid">
                    <div className="marketplace">
                        <div className="row">
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                            <div className="col-md-3">
                                <MarketplaceItem tall/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default ResentMarketplaceListing;