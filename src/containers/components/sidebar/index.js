/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { NavLink, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames'
import {Scrollbars} from 'react-custom-scrollbars';
import * as routes from './routesMenu';
import {setModalType} from '../../../modules/modals';
import ApolloLogo from '../../../assets/apollo-icon.png';
import './Sidebar.scss';

const mapStateToProps = state => ({
	modalType: state.modals.modalType,
    settings: state.accountSettings,
    notifications: state.account.notifications
});

const mapDispatchToProps = dispatch => ({
	setModalType: (modalType) => dispatch(setModalType(modalType))
});

class Sidebar extends React.Component {
	submenuRef = React.createRef();
	menuRef = React.createRef();
	state = {
		isHover: false,
		isMenuCollapsed: false,
	};

	componentDidMount() {
		document.addEventListener('touchstart', this.handleMenuTouchOut);
	}

	componentWillUnmount() {
		document.removeEventListener('touchstart', this.handleMenuTouchOut);
	}

	handleMenuMouseOver = () => {
		this.setState({
			isHover: true
		});
	};

	handleMenuMouseOut = (event) => {
		this.setState({
			isHover: false
		});
	};

	handleMenuTouchOut = (event) => {
		if (this.menuRef && !this.menuRef.contains(event.target) &&
			this.submenuRef && !this.submenuRef.contains(event.target)) {
			this.setState({
				isHover: false
			});
		}
	};

	handleMenuCollapse = () => {
		this.setState({
			...this.state,
			isMenuCollapsed: !this.state.isMenuCollapsed
		})
	};

	createNav = ({className, to, icon, label}) => {
		return <NavLink
			exact={true}
			className={`text ${this.getNavLinkClass([className])}`}
			activeClassName="active"
			to={to}>{label}<i className={`zmdi ${icon} left`}/>
		</NavLink>
	};

	createAdditionalNav = ({id, modalType, label}) => {
		return <li className={`text`}>
			<a id={id} onClick={this.props.setModalType.bind(this, modalType)}>{label}</a>
			<i className="zmdi zmdi-case left"/>
		</li>
	};

	createMenu = menu => {
		let allRoutes = [menu.to];
		allRoutes = allRoutes.concat(menu.children.map(opt => opt.to));
		return <li className={`active-menu ${this.getNavLinkClass(allRoutes)}`}>
			{this.createNav(menu)}
			{this.getNavLinkClass(allRoutes) === 'active' && 
			<>
				{menu.children.map(opt => this.createNav(opt))}
				{menu.additionalChildren && this.createAdditionalNav(menu.additionalChildren)}
			</>}
		</li>
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
					<div>
						<Link
							onMouseOver={this.handleMenuMouseOver}
							onMouseOut={this.handleMenuMouseOut}
							className="site-logo"
							to="/"
						>
							<img src={ApolloLogo} alt={''} />
						</Link>
						<nav
							className={"header-nav"}
							onMouseOver={this.handleMenuMouseOver}
							onMouseOut={this.handleMenuMouseOut}
						>
							<ul>
								{Object.keys(routes).map(rout => this.createMenu(routes[rout]))}
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
