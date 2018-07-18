import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import AssetExchange from "../../account/asset-exchange";

class Sidebar extends React.Component {
    render() {
        return (
            <div className="menu-bar">
                <div className="site-logo">
                    <img/>
                </div>
                <nav>
                    <ul>
                        <li>
                            <i className="zmdi zmdi-view-dashboard left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Dashboard</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><Link to="/dashboard" >Dashboard</Link></li>
                                    <li><Link to="/ledger">Account ledger</Link></li>
                                    <li><Link to="/account-properties">Account properties</Link></li>
                                    <li><Link to="/transactions">My transactions</Link></li>
                                    <li><Link to="/approval-request">Approval requests</Link></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-case left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Asset system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><Link to="/asset-exchange">Asset exchange</Link></li>
                                    <li><Link to="/trade-history">Trade history</Link></li>
                                    <li><Link to="/transfer-history">Transfer history</Link></li>
                                    <li><Link to="/delete-history">Delete history</Link></li>
                                    <li><Link to="/my-assets">My Assets</Link></li>
                                    <li><Link to="/open-orders">Open orders</Link></li>
                                    <li><Link to="approval-request">Approval request</Link></li>
                                    <li><a>Issue Assets</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-money left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Currency system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Currencies</a></li>
                                    <li><a>Exchange hstory</a></li>
                                    <li><a>Transfer history</a></li>
                                    <li><a>Approval requests</a></li>
                                    <li><a>Issue Currencies</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-star left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Voting system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Active pools</a></li>
                                    <li><a>Followed pools</a></li>
                                    <li><a>My votes</a></li>
                                    <li><a>My pools</a></li>
                                    <li><a>Create pool</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-dns left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Data storage</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Search</a></li>
                                    <li><a>File upload</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-label left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Marketplace</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Purchased Products</a></li>
                                    <li><a>My Products For Sales</a></li>
                                    <li><a>My Pending Orders</a></li>
                                    <li><a>My completed orders</a></li>
                                    <li><a>List products for sales</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-circle-o left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Coin shuffling</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Active Shuffling</a></li>
                                    <li><a>My shuffling</a></li>
                                    <li><a>Create shuffling</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-comments left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Messages</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Chat</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-accounts left"></i>
                            <Link to="/my-assets">Aliases</Link>
                        </li>
                        <li>
                            <i className="zmdi zmdi-input-power left"></i>
                            <Link to="/plugins">Plugins</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default Sidebar;