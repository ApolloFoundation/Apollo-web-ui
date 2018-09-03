import React from "react";
import {connect} from 'react-redux';
import {Link, NavLink} from 'react-router-dom';
import './SiteHeader.css';
import {setPageEvents} from '../../../modules/account';
import classNames from 'classnames';
import {setMopalType, setBodyModalType, setBodyModalParamsAction} from "../../../modules/modals";
import {logOutAction} from "../../../actions/login";
import {Form, Text} from 'react-form';
import PrivateTransactions from "../../modals/private-transaction";


import {setModalData} from "../../../modules/modals";
import {getAccountInfoAction} from "../../../actions/account";
import {getTransactionAction} from "../../../actions/transactions";
import {getBlockAction} from "../../../actions/blocks";

class SiteHeader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searching: false
		};

		this.setSearchStateToActive = this.setSearchStateToActive.bind(this);
		this.resetSearchStateToActive = this.resetSearchStateToActive.bind(this);
		this.showItemDropdown = this.showItemDropdown.bind(this);
		this.searchInterval;
	}

	showItemDropdown() {

	}

	setSearchStateToActive() {
		clearInterval(this.searchInterval);
		this.setState({
			...this.state,
			searching: true
		});
	}

	resetSearchStateToActive() {
		this.searchInterval = setTimeout(() => {
			this.setState({
				...this.state,
				searching: false
			});
		}, 4000);
	}

	componentWillReceiveProps() {
		this.getBlock()
	}

	componentDidMount() {
		this.getBlock()
	}

	setBodyModalType(bodyModalType) {
		if (this.props.bodyModalType) {
			// this.props.setBodyModalType(null);

		} else {
			this.props.setBodyModalType(bodyModalType);
		}
	}

	handleSearchind = async (values) => {
		const transaction = await this.props.getTransactionAction({transaction: values.value});
		const block = await this.props.getBlockAction({block: values.value});
		const account = await this.props.getAccountInfoAction({account: values.value});

		if (transaction) {
			this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
		}

		if (block) {
			this.props.setBodyModalParamsAction('INFO_BLOCK', block)
		}

		if (account) {
			this.props.setModalData(account.account);
			this.props.setBodyModalParamsAction('INFO_ACCOUNT', account.account)
		}
	};

	getBlock = async () => {
		const block = await this.props.getBlockAction();

		console.log(block);

		if (block) {
			this.setState({
				block: block
			})
		}
	};

	render() {
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
										!this.props.children &&
										<a
											className="btn primary"
											onClick={this.props.setMopalType.bind(this, 'PrivateTransactions')}
										>
											Show private transactions
										</a>
									}
									{
										this.props.children &&
										this.props.children
									}
									{
										this.props.dashboardPage &&
										<div
											onClick={this.setBodyModalType.bind(this, 'FORGING_BODY_MODAL')}
											className={classNames({
												"underscore": true,
												"general": true,
												"btn": true,
												"icon-button": true,
												"filters": true,
												"primary": true,
												"active": this.props.bodyModalType === "FORGING_BODY_MODAL",
												"revert-content": this.props.bodyModalType === "FORGING_BODY_MODAL",
												"transparent": true,
												"open-settings": true
											})}
										>
											<i className="to-revert zmdi zmdi-chevron-down"/>
											<div className={classNames({
												"settings-bar": true,
												"active": this.props.bodyModalType === "FORGING_BODY_MODAL",
												"no-padding": true
											})}>
												<div className="form-group">
													<div className="form-body">
														<div className="input-section">
															<div className="image-button success">
																<i className="zmdi zmdi-check-circle"/>
																<label>Connected</label>
															</div>
															<a
																to="/messenger"
																className="image-button  danger"
															>
																<i className="zmdi zmdi-close-circle"/>
																<label>Not forging</label>
															</a>
															<a
																to="/messenger"
																className="image-button"
															>
																<i className="zmdi"/>
																{
																	this.state.block &&
																	<label>Height: {this.state.block.height}</label>
																}
															</a>
															<a
																onClick={() => this.props.setBodyModalParamsAction('ACCOUNT_DETAILS')}
																className="image-button"
															>
																<i className="zmdi"/>
																{
																	this.props.forgedBalanceATM &&
																	<label>Apollo: {(this.props.forgedBalanceATM / 100000000).toLocaleString('en')}</label>
																}
															</a>

														</div>
													</div>
												</div>
											</div>

										</div>
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
							<div className={classNames({
								"user-search-box": true,
								"searching": this.state.searching
							})}>
								{/*TODO : fix site header search animation*/}
								<a className="logo" href={"/"}><img src="./apollo-logo.svg"/></a>
								<div className="burger-mobile">
									<div className="line"/>
								</div>
								<div className="mobile-nav">
									<div className={"mobile-nav-item"}>
										<p className="text" onClick={this.showItemDropdown}>
											<i className="zmdi zmdi-view-dashboard"/>Dashboard<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<NavLink exact={true} activeClassName="active"
											         to="/dashboard">Dashboard</NavLink>
											<NavLink exact={true} activeClassName="active" to="/ledger">Account
												ledger</NavLink>
											<NavLink exact={true} activeClassName="active" to="/account-properties">Account
												properties</NavLink>
											<NavLink exact={true} activeClassName="active" to="/transactions">My
												transactions</NavLink>
											<NavLink exact={true} activeClassName="active" to="/approval-request">Approval
												requests</NavLink>
										</div>
									</div>
									<div className={"mobile-nav-item"}>
										<p className="text">
											<i className="zmdi zmdi-case"/>Asset system<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<NavLink exact={true} activeClassName="active" to="/trade-history">Trade
												history</NavLink>
											<NavLink exact={true} activeClassName="active" to="/transfer-history">Transfer
												history</NavLink>
											<NavLink exact={true} activeClassName="active" to="/delete-history">Delete
												history</NavLink>
											<NavLink exact={true} activeClassName="active" to="/my-assets">My
												Assets</NavLink>
											<NavLink exact={true} activeClassName="active" to="/open-orders">Open
												orders</NavLink>
											<NavLink exact={true} activeClassName="active" to="approval-request">Approval
												request</NavLink>

											<a onClick={this.props.setMopalType.bind(this, 'ISSUE_ASSET')}>Issue
												Assets</a>

										</div>
									</div>
									<div className={"mobile-nav-item"}>
										<p className="text">
											<i className="zmdi zmdi-money"/>Currency system<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<NavLink to="/currencies">Currencies</NavLink>
											<NavLink to="/my-shuffling">Exchange history</NavLink>
											<NavLink to="/transfer-history">Transfer history</NavLink>
											<NavLink to="/trade-history">Approval requests</NavLink>

											<a onClick={this.props.setMopalType.bind(this, 'ISSUE_CURRENCIES')}>Issue
												Currencies</a>

										</div>
									</div>
									<div className={"mobile-nav-item"}>
										<p className="text">
											<i className="zmdi zmdi-star"/>Voting system
											<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<NavLink to="/active-pools">Active pools</NavLink>
											<a>Followed pools</a>
											<NavLink to="/my-votes">My votes</NavLink>
											<NavLink to="/my-polls">My pools</NavLink>

											<a onClick={this.props.setMopalType.bind(this, 'ISSUE_POLL')}>Create
												poll</a>

										</div>
									</div>
									<div className={"mobile-nav-item"}>
										<p className="text">
											<i className="zmdi zmdi-dns"/>Data storage<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<NavLink to="/data-storage">Search</NavLink>

											<a onClick={this.props.setMopalType.bind(this, 'ISSUE_FILE_UPLOAD')}>File
												upload</a>

										</div>
									</div>
									<div className={"mobile-nav-item"}>
										<p className="text">
											<i className="zmdi zmdi-label"/>Marketplace<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<a>Purchased Products</a>
											<NavLink to='/my-products-for-sale'>My Products For Sales</NavLink>
											<NavLink to='/my-panding-orders'>My Pending Orders</NavLink>
											<NavLink to='/my-completed-orders'>My completed orders</NavLink>
											<a
												onClick={this.props.setMopalType.bind(this, 'LIST_PRODUCT_FOR_SALE')}>List
												Product For Sale</a>
										</div>
									</div>
									<div className={"mobile-nav-item"}>
										<p className="text">
											<i className="zmdi zmdi-circle-o"/>Coin shuffling
											<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<NavLink to="/active-shuffling">Active Shuffling</NavLink>
											<NavLink to="/finished-shuffling">Finished Shuffling</NavLink>
											<NavLink to="/my-shuffling">My shuffling</NavLink>

											<a onClick={this.props.setMopalType.bind(this, 'ISSUE_CREATE_SHUFFLING')}>Create
												shuffling</a>

										</div>
									</div>
									<div className={"mobile-nav-item"}>
										<p className="text">
											<i className="zmdi zmdi-comments"/>Messages<span className="arrow"/>
										</p>
										<div className="item-dropdown">
											<NavLink exact={true} activeClassName="active"
											         to="/messenger">Chat</NavLink>
										</div>
									</div>
									<NavLink exact={true} activeClassName="active" to="/aliases"
									         className={"mobile-nav-item"}>
										<p className="text">Aliases <i className="zmdi zmdi-accounts"/></p>
									</NavLink>
									<NavLink exact={true} activeClassName="active" to="/plugins"
									         className={"mobile-nav-item"}>
										<p className="text">Plugins <i className="zmdi zmdi-input-power"/></p>
									</NavLink>

								</div>
								<div
									className={classNames({
										'search-bar': true,
									})}
								>

									<Form
										onSubmit={values => this.handleSearchind(values)}
										render={({submitForm, values, addValue, removeValue}) => (
											<form onSubmit={submitForm}>
												<Text
													field={'value'}
													onMouseOut={this.resetSearchStateToActive}
													onMouseDown={this.setSearchStateToActive}
													onMouseOver={this.setSearchStateToActive}
													className={"searching-window"}
													type="text"
													placeholder="Enter Transaction/Account/Block ID"
												/>
											</form>
										)}
									/>


									<div className="user-account-actions">
										<a
											className="user-account-rs"
										>
											{this.props.accountRS}
										</a>
										<a
											className="user-account-action"
											onClick={this.props.setMopalType.bind(this, 'SEND_APOLLO')}
										>
											<i className="zmdi zmdi-balance-wallet"/>
										</a>
										<button
											style={{height: 32}}
											className={classNames({
												"underscore": true,
												"settings": true,
												"btn": true,
												"icon-button": true,
												"filters": true,
												"primary": true,
												"active": this.props.bodyModalType === "SETTINGS_BODY_MODAL",
												"transparent": true,
												"open-settings": true,
												"icon-button ": true,
												"user-account-action": true
											})}
											onClick={this.setBodyModalType.bind(this, 'SETTINGS_BODY_MODAL')}
										>
											<i className="zmdi zmdi-settings"/>
											<div className={classNames({
												"settings-bar": true,
												"active": this.props.bodyModalType === 'SETTINGS_BODY_MODAL'
											})}>
												<div className="options-col">
													<ul>
														<li><Link className="option" to="/blocks">Blocks</Link></li>
														<li><Link className="option" to="/peers">Peers</Link></li>
														<li><Link className="option" to="/generators">Generators</Link>
														</li>
														<li><Link className="option" to="/scheduled-transactions">Scheduled
															transactions</Link></li>
														<li><Link className="option"
														          to="/funding-monitors">monitors</Link></li>
													</ul>
												</div>
												<div className="options-col">
													<ul>
														<li><a
															onClick={() => this.props.setBodyModalParamsAction('TOKEN_GENERATION_VALIDATION')}
															className="option">Generate token</a></li>
														<li><a
															onClick={() => this.props.setBodyModalParamsAction('GENERATE_HALLMARK')}
															className="option">Generate hallmark</a></li>
														<li><a
															onClick={() => this.props.setBodyModalParamsAction('CALCULATE_CACHE')}
															className="option">Calculate hash</a></li>
														<li><a
															onClick={() => this.props.setBodyModalParamsAction('TRANSACTIONS_OPERATIONS')}
															className="option">Transaction operations</a></li>
													</ul>

												</div>
												<div className="options-col">
													<ul>
														<li><a className="option">Refresh search index</a></li>
														<li><a href="https://apollowallet.org/test" className="option">API
															console</a></li>
														<li><a href="https://apollowallet.org/dbshell"
														       className="option">Database shell</a></li>
													</ul>
												</div>
												<div className="options-col">
													<ul>
														<li><Link to="/plugins" className="option">Plugins</Link></li>
														<li><Link to="/settings" className="option">Account
															settings</Link></li>
														<li><a
															onClick={() => this.props.setBodyModalParamsAction('DEVICE_SETTINGS')}
															className="option">Device settings</a></li>
													</ul>
												</div>
											</div>
										</button>
										<a
											onClick={() => this.props.setMopalType('GENERAL_INFO')}
											className="user-account-action user-account-action--help"
										>
											<i className="zmdi zmdi-help"/>
										</a>
										<a className="user-account-action search-button"
										   onClick={this.setSearchStateToActive}>
											<i className="zmdi zmdi-search"/>
										</a>
									</div>
								</div>
								<div
									onClick={this.setBodyModalType.bind(this, 'ACCOUNT_BODY_MODAL')}
									className="user-box"
								>
									<div
										className="user-name"
									>
										<a
											style={{
												height: 25,
												width: 25,
												margin: "0 15px 0 0"
											}}
											className={classNames({
												"underscore": true,
												"account": true,
												"btn": true,
												"icon-button": true,
												"filters": true,
												"primary": true,
												"active": this.props.bodyModalType === "ACCOUNT_BODY_MODAL",
												"revert-content ": this.props.bodyModalType === "ACCOUNT_BODY_MODAL",
												"transparent": true,
												"open-settings": true,
												"icon-button ": true,
												"user-account-action": true
											})}
										>
											<i className="to-revert zmdi zmdi-chevron-down"/>
										</a>
										<a>{this.props.name}</a>

									</div>
									<div className="user-avatar"/>
									<div className={classNames({
										"settings-bar": true,
										"active": this.props.bodyModalType === 'ACCOUNT_BODY_MODAL',
										"no-padding": true
									})}>
										<div className="form-group">
											<div className="form-title">
												<p>Current account</p>
											</div>
											<div className="form-sub-title">
												Not verified profile
											</div>
											<div className="form-body">
												<div className="input-section">
													<div className="row">
														<div className="col-xc-12 col-md-6">
															<a
																className="btn static blue block"
															>
																Set account info
															</a>
														</div>
														<div className="col-xc-12 col-md-6">
															<a
																className="btn static block"
															>
																Switch account
															</a>
														</div>
													</div>
												</div>
												<div className="input-section">
													<a
														style={{
															display: 'block'
														}}
														onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.props.account)}
														className="image-button"
													>
														<i className="zmdi zmdi-account"/>
														<label>Details</label>
													</a>
													<Link
														to="/messenger"
														className="image-button"
													>
														<i className="zmdi zmdi-comments"/>
														<label>Messages</label>
													</Link>

												</div>
												<div className="input-section">
													<Link
														to="/settings"
														className="image-button"
													>
														<i className="zmdi zmdi-settings"/>
														<label>Settings</label>
													</Link>

												</div>
												<div className="input-section">
													<div
														onClick={() => logOutAction('simpleLogOut')}
														className="image-button">
														<i className="zmdi zmdi-power"/>
														<label>Logout</label>
													</div>
													<div className="image-button">
														<i className="zmdi zmdi-power"/>
														<label>Logout and stop forging</label>
													</div>
													<div className="image-button">
														<i className="zmdi zmdi-close-circle"/>
														<label>Logout and clear user data</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	account: state.account.account,
	accountRS: state.account.accountRS,
	name: state.account.name,
	forgedBalanceATM: state.account.forgedBalanceATM,
	moalTtype: state.modals.modalType,
	bodyModalType: state.modals.bodyModalType
});

const mapDispatchToProps = dispatch => ({
	setPageEvents: (prevent) => dispatch(setPageEvents(prevent)),
	setMopalType: (prevent) => dispatch(setMopalType(prevent)),
	setBodyModalType: (prevent) => dispatch(setBodyModalType(prevent)),
	getAccountInfoAction: (reqParams) => dispatch(getAccountInfoAction(reqParams)),
	getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
	getBlockAction: (reqParams) => dispatch(getBlockAction(reqParams)),
	setModalData: (reqParams) => dispatch(setModalData(reqParams)),
	setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});


export default connect(mapStateToProps, mapDispatchToProps)(SiteHeader);