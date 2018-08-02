import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import './Sidebar.css';
import AssetExchange from "../../account/asset-exchange";
import {setMopalType} from "../../../modules/modals";

class Sidebar extends React.Component {
    render() {
        return (
            <div className="menu-bar">
                <div className="site-logo">
                    <img src="./apollo-logo.svg"/>
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
                                    <li><Link to="/trade-history">Trade history</Link></li>
                                    <li><Link to="/transfer-history">Transfer history</Link></li>
                                    <li><Link to="/delete-history">Delete history</Link></li>
                                    <li><Link to="/my-assets">My Assets</Link></li>
                                    <li><Link to="/open-orders">Open orders</Link></li>
                                    <li><Link to="approval-request">Approval request</Link></li>
                                    <li>
                                        <a onClick={this.props.setMopalType.bind(this, 'ISSUE')}>Issue Assets</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-money left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <Link to="/currencies">Currency system</Link>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><Link to="/exchange-booth">Exchange booth</Link></li>
                                    <li><Link to="/currencies">Currencies</Link></li>
                                    <li><Link to="/my-shuffling">Exchange history</Link></li>
                                    <li><Link to="/transfer-history">Transfer history</Link></li>
                                    <li><Link to="/trade-history">Approval requests</Link></li>
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
                                    <li><Link to="/active-pools">Active pools</Link></li>
                                    <li><a>Followed pools</a></li>
                                    <li><Link to="/my-votes">My votes</Link></li>
                                    <li><Link to="/my-polls">My pools</Link></li>
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
                                    <li><Link to="/data-storage">Search</Link></li>
                                    <li><a>File upload</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-label left"></i>
                            <i className="zmdi zmdi-chevron-right right"></i>
                            <Link to='/marketplace'>Marketplace</Link>
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
                            <Link to='/messenger'>Messages</Link>
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a>Chat</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <i className="zmdi zmdi-accounts left"></i>
                            <Link to="/aliases">Aliases</Link>
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

const mapStateToProps = state => ({
    modalType : state.modals.modalType
});

const mapDispatchToProps = dispatch => ({
    setMopalType: (modalType) => dispatch(setMopalType(modalType))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);