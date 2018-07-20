import React from 'react';
import SiteHeader from '../../components/site-header';
import MarketplaceItem from './marketplace-card'
import classNames from "classnames";

import './MarketPLace.css';

class Marketplace extends React.Component {
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
                    pageTitle={'Marketplace'}
                />
                <div className="page-body container-fluid">
                    <div className="marketplace">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card fll-height marketplace product-box">

                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card fll-height header ballance">
                                    <div className="full-box full">
                                        <div className="full-box-item">
                                            <span className="card-title align-left">Purchased products</span>
                                            <span className="card-title align-right">2</span>
                                        </div>
                                        <div className="full-box-item">
                                            <p className="card-title align-left">Products available</p>
                                            <p className="card-title align-right">668</p>
                                        </div>
                                        <div className="full-box-item">
                                            <p className="card-title align-left">Total purchases</p>
                                            <p className="card-title align-right">58</p>
                                        </div>
                                        <div className="full-box-item">
                                            <p className="card-title  align-left">Total tags</p>
                                            <p className="card-title  align-right">664</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card  marketplace filters transparent">
                                    <div className="search-bar">
                                        <div className="input-group search">
                                            <input type="text"/>
                                            <div className="input-icon">
                                                <i className="zmdi zmdi-search"></i>
                                            </div>
                                        </div>
                                        <div className="input-group search">
                                            <input type="text"/>
                                            <div className="input-icon">
                                                <i className="zmdi zmdi-search"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filters-bar">
                                        <div className="btn primary">Alias [305]</div>
                                        <div className="btn primary">Aliases [46]</div>
                                        <div className="btn primary">Apollo [34]</div>
                                        <div className="btn primary">Chinese [19]</div>
                                        <div className="btn primary">Alphaomega [18]</div>
                                        <div className="btn primary">Vanityid [18]</div>
                                        <div className="btn primary">Indigocreekfood [12]</div>
                                        <div className="btn primary">Bible [11]</div>
                                        <div className="btn primary">Djs [11]</div>
                                        <div className="btn primary">Djs [11]</div>
                                        <div className="btn primary blue">View more</div>

                                    </div>
                                </div>
                            </div>
                            <div className="form-group transparent marketplace no-padding-bottom">
                                <div className="form-title padding-left offset-bottom">
                                    <p>Recent listings</p>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>

                                </div>
                            </div>
                            <div className="form-group transparent marketplace no-padding-bottom">
                                <div className="form-title padding-left offset-bottom">
                                    <p>Recent purchases</p>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                    <div className="col-md-2">
                                        <MarketplaceItem/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Marketplace;