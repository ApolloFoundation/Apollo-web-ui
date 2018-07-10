import React from 'react';
import { Link } from 'react-router-dom';

class Sidebar extends React.Component {
    render() {
        return (
            <div className="menu-bar">
                <div className="site-logo">
                    <img/>
                </div>
                <nav>
                    <ul>
                        <li><a>Dashboard</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Asset system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Currency system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Voting system</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Data storage</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Marketplace</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Coin shuffling</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions
                                        <li><a>Approval requests</a>
                                        </li>
                                    </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Messages</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Aliases</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li><a>Plugins</a>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Dashboard</a>
                                    </li>
                                    <li><a>Account ledger</a>
                                    </li>
                                    <li><a>Account properties</a>
                                    </li>
                                    <li><a>My transactions</a>
                                    </li>
                                    <li><a>Approval requests</a>
                                    </li>
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