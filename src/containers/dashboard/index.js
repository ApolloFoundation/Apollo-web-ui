import React from 'react';

class Dashboard extends React.Component {
    render () {
        return (
            <div className="page-content">
                <div className="page-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="page-title-box">
                                    <div className="page-title-box">
                                        <p className="title">Dashboard</p>
                                        <div className="breadcrumbs">
                                            <a>Apollo Wallet /</a>
                                            <strong>
                                                <a>Dashboard</a>
                                            </strong>
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
                                        <div className="user-avatar">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body container-fluid">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card header ballance">
                                <div className="card-title">Available Balance</div>
                                <div className="amount">37,000,000</div>
                            </div>
                            <div className="card card-tall transactions">
                                <div className="card-title">Transactions</div>
                                <div className="transactions-dashboard">
                                    <div className="transaction-item">
                                        <div className="transaction-box">
                                            <div className="transaction-date">15:00, 12 dec 2018</div>
                                            <div className="transaction-rs">APL-NZKH-MZRE-2CTT-98NPW</div>
                                            <div className="transaction-amount">75,000</div>
                                        </div>
                                    </div>
                                    <div className="transaction-item">
                                        <div className="transaction-box">
                                            <div className="transaction-date">15:00, 12 dec 2018</div>
                                            <div className="transaction-rs">APL-NZKH-MZRE-2CTT-98NPW</div>
                                            <div className="transaction-amount">75,000</div>
                                        </div>
                                    </div>
                                    <div className="transaction-item">
                                        <div className="transaction-box">
                                            <div className="transaction-date">15:00, 12 dec 2018</div>
                                            <div className="transaction-rs">APL-NZKH-MZRE-2CTT-98NPW</div>
                                            <div className="transaction-amount">75,000</div>
                                        </div>
                                    </div>
                                    <div className="transaction-item">
                                        <div className="transaction-box">
                                            <div className="transaction-date">15:00, 12 dec 2018</div>
                                            <div className="transaction-rs">APL-NZKH-MZRE-2CTT-98NPW</div>
                                            <div className="transaction-amount">75,000</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card header assets">
                                <div className="card-title">Assets Value</div>
                                <div className="amount">37,000,000</div>
                            </div>
                            <div className="card asset-portfolio">
                                <div className="card-title">Asset Portfolio</div>
                                <div className="full-box">
                                    <div className="full-box-item coin">
                                        <div className="coin-data">
                                            <div className="figure"></div>
                                            <div className="amount">81%</div>
                                            <div className="coin-name">Bitcoin</div>
                                        </div>
                                        <div className="more"></div>
                                    </div>
                                    <div className="full-box-item coin">
                                        <div className="coin-data">
                                            <div className="figure"></div>
                                            <div className="amount">81%</div>
                                            <div className="coin-name">Bitcoin</div>
                                        </div>
                                        <div className="more"></div>
                                    </div>
                                    <div className="full-box-item coin">
                                        <div className="coin-data">
                                            <div className="figure"></div>
                                            <div className="amount">81%</div>
                                            <div className="coin-name">Bitcoin</div>
                                        </div>
                                        <div className="more"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card decentralized-marketplace">
                                <div className="card-title">Decentralized Marketplace</div>
                                <div className="full-box">
                                    <div className="full-box-item">
                                        <div className="marketplace-box">
                                            <div className="digit">5</div>
                                            <div className="subtitle">Purchased products</div>
                                        </div>
                                        <div className="marketplace-box">
                                            <div className="digit">1/2</div>
                                            <div className="subtitle">Sales</div>
                                        </div>
                                    </div>
                                </div>
                                <a className="btn btn-left btn-simple">Marketplace</a>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card header currencies">
                                <div className="card-title">Currencies Value</div>
                            </div>
                            <div className="card send-apollo">
                                <div className="card-title">Send Apollo</div>
                                <div className="full-box">
                                    <div className="form-group offset">
                                        <div className="input-group lighten">
                                            <label>Wallet</label>
                                            <input type="number"/>
                                        </div>
                                        <div className="input-group lighten">
                                            <label>Amount</label>
                                            <input/>
                                        </div>
                                        <div className="input-group lighten">
                                            <label>Send to</label>
                                            <input/>
                                        </div>
                                    </div>
                                </div>
                                <a className="btn btn-left btn-simple">Private APL</a>
                                <div className="btn btn-right" data-modal="sendMoney">Send</div>
                            </div>
                            <div className="card active-polls">
                                <div className="card-title">Active Polls</div>
                                <div className="full-box block">
                                    <p>Search for Zerp on the Asset Exchange section.</p>
                                    <p>What features should be implemented in apollo platform?</p>
                                    <p>Apollo to have future USD/Fiat Pairs on Exchange?</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card header coins">

                            </div>
                            <div className="card card-tall apollo-news">
                                <div className="card-title">Apollo News</div>
                                <div className="card-news-content">Lorem ipsum dolor sit amet, consectetur adipiscing
                                    elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat. Duis
                                    aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                    nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                    officia deserunt mollit anim id est laborum.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Dashboard;
