/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { NavLink, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import classNames from 'classnames'
import {setModalType} from '../../../modules/modals';
import * as routes from './routesMenu';
import ApolloLogo from '../../../assets/new_apl_icon_black.svg';
import './Sidebar.scss';

const mapStateToProps = state => ({
	modalType: state.modals.modalType,
	settings: state.accountSettings,
	notifications: state.account.notifications,
	chainId: state.account.blockchainStatus.chainId,
});

const mapDispatchToProps = {
	setModalType,
};

class Sidebar extends React.Component {
	// submenuRef = React.createRef();
	// menuRef = React.createRef();
	state = {
		isHover: false,
		isMenuCollapsed: false,
		activeMenu: null,
		smartContractAddress: '#',
	};

	componentDidMount() {
		this.getServer();
		// document.addEventListener('touchstart', this.handleMenuTouchOut);
	}

	componentDidUpdate(prevProps){
		if(prevProps.chainId !== this.props.chainId) {
			this.getServer();
		}
	}
	//
	// componentWillUnmount(prevProps) {
	// 	document.removeEventListener('touchstart', this.handleMenuTouchOut);
	// }

	getServer = () => {
		if (this.props.chainId) {
			const chainIdValue = this.props.chainId.split('-');
			const addresses = JSON.parse(process.env.REACT_APP_SMC_URL);
			this.setState({ smartContractAddress: addresses[chainIdValue[0]] });
		}
	}

	// handleMenuMouseOver = () => {
	// 	this.setState({
	// 		isHover: true
	// 	});
	// };
	//
	// handleMenuMouseOut = (event) => {
	// 	this.setState({
	// 		isHover: false
	// 	});
	// };
	//
	// handleMenuTouchOut = (event) => {
	// 	if (this.menuRef && this.menuRef.contains && !this.menuRef.contains(event.target) &&
	// 		this.submenuRef && !this.submenuRef.contains(event.target)) {
	// 		this.setState({
	// 			isHover: false
	// 		});
	// 	}
	// };

	handleMenuCollapse = () => {
		this.setState({
			isMenuCollapsed: !this.state.isMenuCollapsed
		})
	};

	createNav = ({className, to, isExternal, icon, label}) => {
		return (
      <NavLink
				key={to}
        exact={true}
        className={`text ${this.getNavLinkClass(className)}`}
        activeClassName="active"
        to={isExternal ? { pathname: to } : to}
        target={isExternal ? '_blank' : ''}
      >
        {label}<i className={`zmdi ${icon} left`}/>
		  </NavLink>
    )
	};

	createItemMenu = ({to, isExternal, className, icon, label, children}) => {
		return this.state.activeMenu === to || !children
		? (this.createNav({to, isExternal, className, icon, label}))
		: (<a className={`text ${this.getNavLinkClass(className)}`} onClick={() => this.hanldeActive(to)}>
			{label}<i className={`zmdi ${icon} left`}/>
			</a>)
	}

	createAdditionalNav = ({id, modalType, label}) => {
		return <a className={`text`} onClick={() => this.props.setModalType(modalType)}>
				{label}<i className="zmdi zmdi-case left"/>
		</a>
	};

	createMenu = menu => {
		let allRoutes = menu.className instanceof Array ? menu.className : [menu.className];
		allRoutes = allRoutes.concat(menu.children?.map(opt => opt.to));
		if (menu.to === '#' || !menu.to) return null;
		return (
			<li key={menu.to} className={`active-menu ${this.getNavLinkClass(allRoutes)}`}>
				{this.createItemMenu(menu)}
				<>
					{menu.children?.map(opt => this.createNav(opt))}
					{menu.additionalChildren && this.createAdditionalNav(menu.additionalChildren)}
				</>
			</li>
		)
	};

	hanldeActive = (activeMenu) => {this.setState({activeMenu})};

	getNavLinkClass = (path) => {
		const routes = path instanceof Array ? path : [path];
		if(routes.some(i => window.location.pathname === i)) return 'active';
		else if(routes.some(i => this.state.activeMenu === i)) return 'open';
		return ''
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
					className={classNames({
						"menu-bar-container": true,
						"collapsed": !this.state.isMenuCollapsed,
					})}
					id={'sidebar-menu'}
				>
					<div>
						<Link
							onMouseOver={this.handleMenuMouseOver}
							onMouseOut={this.handleMenuMouseOut}
							className="site-logo"
							to="/"
						>
							<img src={ApolloLogo} atl='' />
						</Link>
						<nav
							className={"header-nav"}
							onMouseOver={this.handleMenuMouseOver}
							onMouseOut={this.handleMenuMouseOut}
						>
							<ul>
								{
									Object.entries(routes).map(([key, rout]) => key === 'smartContracts' 
										? this.createMenu(rout(this.state.smartContractAddress)) : this.createMenu(rout))
								}
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
				</div>
			</Scrollbars>
		);
	}
}

export default connect(mapStateToProps,	mapDispatchToProps)(Sidebar);
