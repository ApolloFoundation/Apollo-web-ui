import React from "react";
import './SiteHeader.css';

class SiteHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        return (
            <div className="page-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="page-title-box">
                                <div className="page-title-box">
                                    <h1 className="title">{this.props.pageTitle}</h1>
                                    {
                                        this.props.showPrivateTransactions &&
                                        <a className="btn primary">Show private transactions</a>

                                    }
                                    <div className="breadcrumbs">
                                        <a>Apollo Wallet /</a>
                                        <strong>
                                            <a>{this.props.pageTitle}</a>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="user-search-box">
                                <div className="search-bar">
                                    <input type="text"/>
                                    <div className="user-account-actions">
                                        <a className="user-account-rs">
                                            APL-P7FK-7FAQ-U632-E2EN6
                                        </a>
                                        <a className="user-account-action"><i className="zmdi zmdi-balance-wallet"></i></a>
                                        <a className="user-account-action"><i className="zmdi zmdi-settings"></i></a>
                                        <a className="user-account-action"><i className="zmdi zmdi-help"></i></a>
                                        <a className="user-account-action"><i className="zmdi zmdi-search"></i></a>
                                    </div>
                                </div>
                                <div className="user-box">
                                    <div className="user-name">
                                        <i className="zmdi zmdi-chevron-down"></i>
                                        <a>Viktoria Apollo</a>
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