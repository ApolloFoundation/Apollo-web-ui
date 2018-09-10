import React from 'react';
import { NavNavLink, NavLink, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import './Sidebar.css';
import AssetExchange from "../../account/asset-exchange";
import {setMopalType} from "../../../modules/modals";
import classNames from 'classnames'


const mapStateToProps = state => ({
    modalType : state.modals.modalType,
    notifications: state.account.notifications
});

const mapDispatchToProps = dispatch => ({
    setMopalType: (modalType) => dispatch(setMopalType(modalType))
});

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isHover: false,
        isMenuCollapsed: false
    };

    handleMenuMouseOver = () => {
        this.setState({
            isHover: true
        });
    };

    handleMenuMouseOut = () => {
        this.setState({
            isHover: false
        });
    };

    handleMenuCollapse = () => {
        this.setState({
            ...this.state,
            isMenuCollapsed: !this.state.isMenuCollapsed
        })
    };

    render() {
        return (
            <div
                className={classNames({
                    "menu-bar": true,
                    "collapsed": this.state.isMenuCollapsed,
                    "hover": this.state.isHover
                })}
            >
                <div className="menu-bar-container">
                    <div
                        onMouseOver={this.handleMenuMouseOver}
                        onMouseOut={this.handleMenuMouseOut}
                        className="site-logo"
                    >
                        <img src="./apollo-logo.svg"/>
                    </div>

                    <nav
                        className={"header-nav"}
                        onMouseOver={this.handleMenuMouseOver}
                        onMouseOut={this.handleMenuMouseOut}
                    >
                        <ul>
                            <li>

                                <NavLink to="/dashboard">
                                    Dashboard
                                    {
                                        this.props.notifications && this.props.notifications[1].notificationCount  === 0 &&
                                        <i className="zmdi zmdi-view-dashboard left" />
                                    }
                                    {
                                        this.props.notifications && this.props.notifications[1].notificationCount > 0 &&
                                        <i className="zmdi zmdi-view-dashboard left" data-notification={this.props.notifications[0].notificationCount} />
                                    }

                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink exact={true} activeClassName="active" to="/dashboard" >Dashboard</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/ledger">Account ledger</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/account-properties">Account properties</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/transactions">My transactions</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/approval-request">Approval requests</NavLink></li>
                                    </ul>
                                </div>
                            </li>
                            <li>

                                <NavLink  exact={true} activeClassName="active" to="/my-assets">
                                    Asset system
                                    <i className="zmdi zmdi-case left" />
                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink exact={true} activeClassName="active" to="/trade-history">Trade history</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/transfer-history">Transfer history</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/delete-history">Delete history</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/my-assets">My Assets</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/open-orders">Open orders</NavLink></li>
                                        <li><NavLink exact={true} activeClassName="active" to="/approval-request">Approval request</NavLink></li>
                                        <li>
                                            <a onClick={this.props.setMopalType.bind(this, 'ISSUE_ASSET')}>Issue Assets</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink to="/currencies">
                                    Currency system
                                    <i className="zmdi zmdi-money left" />
                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink to="/currencies">Currencies</NavLink></li>
                                        <li><NavLink to="/my-shuffling">Exchange history</NavLink></li>
                                        <li><NavLink to="/transfer-history-currency">Transfer history</NavLink></li>
                                        <li><NavLink to="/trade-history-currency">Trade history</NavLink></li>
                                        <li>
                                            <a onClick={this.props.setMopalType.bind(this, 'ISSUE_CURRENCIES')}>Issue Currencies</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink exact={true} activeClassName="active" to="/active-polls">
                                    Voting system
                                    <i className="zmdi zmdi-star left" />
                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink to="/active-polls">Active polls</NavLink></li>
                                        <li><NavLink to='/followed-polls'>Followed polls</NavLink></li>
                                        <li><NavLink to="/my-votes">My votes</NavLink></li>
                                        <li><NavLink to="/my-polls">My polls</NavLink></li>
                                        <li>
                                            <a onClick={this.props.setMopalType.bind(this, 'ISSUE_POLL')}>Create poll</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink exact={true} activeClassName="active"  to="/data-storage">
                                    Data storage
                                    <i className="zmdi zmdi-dns left" />
                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink to="/data-storage">Search</NavLink></li>
                                        <li>
                                            <a onClick={this.props.setMopalType.bind(this, 'ISSUE_FILE_UPLOAD')}>File upload</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink exact={true} activeClassName="active"  to='/marketplace'>
                                    Marketplace
                                    <i className="zmdi zmdi-label left" />
                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink to='/purchased-products'>Purchased Products</NavLink></li>
                                        <li><NavLink to='/my-products-for-sale'>My Products For Sales</NavLink></li>
                                        <li><NavLink to='/my-panding-orders'>My Pending Orders</NavLink></li>
                                        <li><NavLink to='/my-completed-orders'>My completed orders</NavLink></li>
                                        <li><a onClick={this.props.setMopalType.bind(this, 'LIST_PRODUCT_FOR_SALE')}>List Product For Sale</a></li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink exact={true} activeClassName="active"  to="/active-shuffling">
                                    Coin shuffling
                                    <i className="zmdi zmdi-circle-o left" />
                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink to="/active-shuffling">Active Shuffling</NavLink></li>
                                        <li><NavLink to="/finished-shuffling">Finished Shuffling</NavLink></li>
                                        <li><NavLink to="/my-shuffling">My shuffling</NavLink></li>
                                        <li>
                                            <a onClick={this.props.setMopalType.bind(this, 'ISSUE_CREATE_SHUFFLING')}>Create shuffling</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink exact={true} activeClassName="active"  to='/my-messages'>
                                    Messages
                                    {
                                        this.props.notifications && this.props.notifications[1].notificationCount  === 0 &&
                                        <i className="zmdi zmdi-comments left" />
                                    }
                                    {
                                        this.props.notifications && this.props.notifications[1].notificationCount > 0 &&
                                        <i className="zmdi zmdi-comments left" data-notification={this.props.notifications[1].notificationCount} />
                                    }

                                    <i className="zmdi zmdi-chevron-right right" />
                                </NavLink>
                                <div className="dropdown-menu">
                                    <ul>
                                        <li><NavLink exact={true} activeClassName="active"  to="/messenger">Chat</NavLink></li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink exact={true} activeClassName="active"  to="/aliases">
                                    Aliases
                                    <i className="zmdi zmdi-accounts left" />
                                </NavLink>
                            </li>
                            <li>
                                <NavLink exact={true} activeClassName="active"  to="/plugins">
                                    Plugins
                                    <i className="zmdi zmdi-input-power left" />
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                    <a
                        className={classNames({
                            "collapse-button": true,
                            "active": this.state.isMenuCollapsed
                        })}
                       onClick={this.handleMenuCollapse}
                    >
                        <i className="zmdi zmdi-chevron-right left" />
                    </a>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);