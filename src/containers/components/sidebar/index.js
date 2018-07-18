import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

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
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-money left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Currency system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-star left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Voting system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-dns left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Data storage</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-label left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Marketplace</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-circle-o left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Coin shuffling</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-comments left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Messages</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-accounts left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Aliases</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-input-power left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <a>Plugins</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a></li>
                                    <li><a>Account ledger</a></li>
                                    <li><a>Account properties</a></li>
                                    <li><a>My transactions</a></li>
                                    <li><a>Approval requests</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default Sidebar;