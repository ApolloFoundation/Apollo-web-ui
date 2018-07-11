import React from "react";

class SiteHeader extends React.Component {
    render() {
        return (
            <div className="page-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="page-title-box">
                                <div className="page-title-box">
                                    <h1 className="title">Account ledger</h1><a className="btn primary">Show private
                                    transactions</a>
                                    <div className="breadcrumbs"><a>Apollo Wallet /</a><strong><a>Account
                                        ledger</a></strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="user-search-box">
                                <div className="search-bar">
                                    <input type="text"/>
                                </div>
                                <div className="user-box">
                                    <div className="user-name"><a>Viktoria Apollo</a>
                                    </div>
                                    <div className="user-avatar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SiteHeader;