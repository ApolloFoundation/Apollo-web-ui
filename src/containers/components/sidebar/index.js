/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {NavNavLink, NavLink, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './Sidebar.css';
import AssetExchange from "../../account/asset-exchange";
import {setModalType} from "../../../modules/modals";
import classNames from 'classnames'
import {Scrollbars} from 'react-custom-scrollbars';

const mapStateToProps = state => ({
	modalType: state.modals.modalType,
    settings: state.accountSettings,
    notifications: state.account.notifications
});

const mapDispatchToProps = dispatch => ({
	setModalType: (modalType) => dispatch(setModalType(modalType))
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

	getNavLinkClass = (path) => {
		return path.some(i => window.location.pathname === i) ? 'active' : '';
	};

	render() {
		return (
			<Scrollbars
				renderView={props => <div {...props} className="track-content-view"/>}
				renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
				renderTrackVertical={props => <div {...props} className="track-vertical"/>}
				className={classNames({
					"menu-bar": true,
					"collapsed": this.state.isMenuCollapsed,
					"hover": this.state.isHover
				})}
			>
				<div
					className="menu-bar-container"
					id={'sidebar-menu'}
				>
					<NavLink
						onMouseOver={this.handleMenuMouseOver}
						onMouseOut={this.handleMenuMouseOut}
						className="site-logo"
						style={{
							background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
						}}
						exact={true} activeClassName="active" to="/"
					>
						<img src="/apollo-logo.svg"/>
					</NavLink>

					<nav
						className={"header-nav"}
						onMouseOver={this.handleMenuMouseOver}
						onMouseOut={this.handleMenuMouseOut}
					>
						<ul
							style={{
                                "paddingBottom": "120px",
                                "background": this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'

                            }}
						>
							<li
                                style={{
                                    background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                }}
							>
								<NavLink exact={true}
                                         style={{
                                             background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                         }}
										 activeClassName="active" to="/dashboard"
								         className={`text ${this.getNavLinkClass(["/",
									         "/dashboard",
									         "/ledger",
									         "/account-properties",
									         "/transactions",
									         "/approval-request"])
									         }`}>
									Dashboard
									{/*{*/}
										{/*this.props.notifications && this.props.notifications[1].notificationCount === 0 &&*/}
										{/*<i className="zmdi zmdi-view-dashboard left"/>*/}
									{/*}*/}
									{/*{*/}
										{/*this.props.notifications && this.props.notifications[1].notificationCount > 0 &&*/}
										{/*<i className="zmdi zmdi-view-dashboard left"*/}
										   {/*data-notification={this.props.notifications[0].notificationCount}/>*/}
									{/*}*/}
									<i className="zmdi zmdi-view-dashboard left"/>
									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									className="dropdown-menu"
								>
									<ul>
										<li><NavLink exact={true} activeClassName="active"
										             to="/dashboard">Dashboard</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/ledger">Account
											ledger</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/account-properties">Account
											properties</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/transactions">My
											transactions</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/approval-request">Approval
											requests</NavLink></li>
									</ul>
								</div>
							</li>
							<li>

								<NavLink exact={true}
                                         style={{
                                             background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                         }}
										 activeClassName="active" to="/asset-exchange"
								         className={`text ${this.getNavLinkClass(["/trade-history",
									         "/transfer-history",
									         "/delete-history",
									         "/my-assets",
									         "/open-orders",
									         "approval-request",
											 "/approval-request-assets"])}`}>
									Asset system
									<i className="zmdi zmdi-case left"/>
									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									className="dropdown-menu"
								>
									<ul>
                                        <li>
                                            <NavLink exact={true} activeClassName="active" to="/asset-exchange">
                                                Asset exchange
                                            </NavLink>
                                        </li>
										<li>
											<NavLink exact={true} activeClassName="active" to="/trade-history">
												Trade history
											</NavLink>
										</li>
										<li><NavLink exact={true} activeClassName="active" to="/transfer-history">Transfer
											history</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/delete-history">Delete
											history</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/my-assets">My
											assets</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/open-orders">Open
											orders</NavLink></li>
										<li><NavLink exact={true} activeClassName="active" to="/approval-request-assets">Approval
											requests</NavLink></li>
										<li>
											<a onClick={this.props.setModalType.bind(this, 'ISSUE_ASSET')}>Issue
												assets</a>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<NavLink
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									to="/currencies"
										 className={`text ${this.getNavLinkClass(["/currencies",
									// "/my-shuffling",
									"/transfer-history-currency",
									"/exchange-history-currency"])}`}>
									Currency system
									<i className="zmdi zmdi-money left"/>
									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									className="dropdown-menu"
								>
									<ul>
										<li><NavLink to="/currencies">Currencies</NavLink></li>
										{/*<li><NavLink to="/my-shuffling">Exchange history</NavLink></li>*/}

										<li><NavLink to="/my-currencies">My currencies</NavLink></li>
										<li><NavLink to="/transfer-history-currency">Transfer history</NavLink></li>
										<li><NavLink to="/exchange-history-currency">Exchange history</NavLink></li>
										<li>
											<a onClick={this.props.setModalType.bind(this, 'ISSUE_CURRENCIES')}>Issue
												currencies</a>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<NavLink
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									to="/active-polls"
									className={`text ${this.getNavLinkClass(["/active-polls",
									"/followed-polls",
									"/my-votes",
									"/my-polls"])}`}>
									Voting system
									<i className="zmdi zmdi-star left"/>
									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									className="dropdown-menu"
								>
									<ul>
										<li><NavLink to="/active-polls">Active polls</NavLink></li>
										<li><NavLink to='/followed-polls'>Followed polls</NavLink></li>
										<li><NavLink to="/my-votes">My votes</NavLink></li>
										<li><NavLink to="/my-polls">My polls</NavLink></li>
										<li>
											<a onClick={this.props.setModalType.bind(this, 'ISSUE_POLL')}>Create
												poll</a>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<NavLink
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									to="/data-storage"
								         className={`text ${this.getNavLinkClass(["/data-storage"])}`}>
									Data storage
									<i className="zmdi zmdi-dns left"/>
									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									className="dropdown-menu"
								>
									<ul>
										<li><NavLink to="/data-storage">Search</NavLink></li>
										<li>
											<a onClick={this.props.setModalType.bind(this, 'ISSUE_FILE_UPLOAD')}>File
												upload</a>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<NavLink
									style={{
										background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
									}}
									to='/marketplace'
									className={`text ${this.getNavLinkClass(["/my-products-for-sale",
										"/my-pending-orders",
										"/my-completed-orders",
										"/recent-listing",
										"/purchased-products"])}`}>
									Marketplace
									<i className="zmdi zmdi-label left"/>
									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
									style={{
										background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
									}}
									className="dropdown-menu"
								>
									<ul>
										<li><NavLink to='/purchased-products'>Purchased products</NavLink></li>
										<li><NavLink to='/my-products-for-sale'>My products for sale</NavLink></li>
										<li><NavLink to='/my-pending-orders'>My pending orders</NavLink></li>
										<li><NavLink to='/my-completed-orders'>My completed orders</NavLink></li>
										<li><a onClick={this.props.setModalType.bind(this, 'LIST_PRODUCT_FOR_SALE')}>List
											product for sale</a></li>
									</ul>
								</div>
							</li>
							<li>
								<NavLink
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									to="/active-shuffling"
								         className={`text ${this.getNavLinkClass(["/active-shuffling",
									         "/finished-shuffling",
									         "/my-shuffling"])}`}>
									Coin shuffling
									<i className="zmdi zmdi-circle-o left"/>
									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									className="dropdown-menu"
								>
									<ul>
										<li><NavLink to="/active-shuffling">Active shuffling</NavLink></li>
										<li><NavLink to="/finished-shuffling">Finished shuffling</NavLink></li>
										<li><NavLink to="/my-shuffling">My shuffling</NavLink></li>
										<li>
											<a onClick={this.props.setModalType.bind(this, 'ISSUE_CREATE_SHUFFLING')}>Create
												shuffling</a>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<NavLink
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									exact={true}
									activeClassName="active"
									to="/my-messages"
									className={`text ${this.getNavLinkClass(["/messenger"])}`}
								>
									Messages
									{
										this.props.notifications && this.props.notifications[1].notificationCount === 0 &&
										<i className="zmdi zmdi-comments left"/>
									}
									{
										this.props.notifications && this.props.notifications[1].notificationCount > 0 &&
										<i className={`zmdi zmdi-comments left ${this.props.notifications[1].notificationCount > 99 && 'big-count'}`}
										   data-notification={this.props.notifications[1].notificationCount}/>
									}

									<i className="zmdi zmdi-chevron-right right"/>
								</NavLink>
								<div
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
									className="dropdown-menu"
								>
									<ul>
										<li>
											<NavLink
												// exact={true}
												activeClassName="active"
												to="/messenger"
											>
												Chat
											</NavLink>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<NavLink
                                    style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}className={"text"} exact={true} activeClassName="active" to="/aliases">
									Aliases
									<i className="zmdi zmdi-accounts left"/>
								</NavLink>
							</li>
							<li>
							{/*<NavLink
								style={{
                                        background: this.props.settings.sidebar !== '#F5F5F5' ? this.props.settings.sidebar : '#333'
                                    }}
								exact={true} activeClassName="active"  to="/plugins">
                                    Plugins
                                    <i className="zmdi zmdi-input-power left" />
                                </NavLink>*/}
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
						<i className="zmdi zmdi-chevron-right left"/>
					</a>
				</div>
			</Scrollbars>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Sidebar);