/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState, memo } from 'react';
import { Link, useLocation} from 'react-router-dom';
import {Scrollbars} from 'react-custom-scrollbars';
import classNames from 'classnames'
import ApolloLogo from 'assets/new_apl_icon_black.svg';
import {ExternalLink} from './ExternalLink';
import { LinkBlock } from './LinkBlock';
import * as routes from './routesMenu';
import { SmartContractLink } from './SmartContractLink';
import './Sidebar.scss';

const Sidebar = () => {
	const location = useLocation();
	const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
	const [activeMenu, setActiveMenu] = useState(null);

	const handleMenuCollapse = () => {
		setIsMenuCollapsed(state => !state);
	};
	
	const hanldeActive = (activeMenu) => () => {
		setActiveMenu(activeMenu);
	}

	return (
		<Scrollbars
			renderView={props => <div {...props} className="track-content-view"/>}
			renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
			renderTrackVertical={props => <div {...props} className="track-vertical"/>}
			className={classNames("menu-bar", {
				"collapsed": isMenuCollapsed,
			})}
		>
			<div
				className={classNames("menu-bar-container", {
					"collapsed": !isMenuCollapsed,
				})}
				id='sidebar-menu'
			>
				<div>
					<Link className="site-logo" to="/">
						<img src={ApolloLogo} atl='' />
					</Link>
					<nav className="header-nav">
						<ul>
							{
								Object.values(routes).map((routeInfo, index) => {
									if (routeInfo.isSmartContract)  {
										return <SmartContractLink key={routeInfo.label} data={routeInfo} />
									}

									if (routeInfo.isExternal) {
										return <ExternalLink key={routeInfo.label} {...routeInfo} />
									}

									return (
										<LinkBlock
											key={routeInfo[0].to}
											routeItemInfo={routeInfo}
											onActiveClick={hanldeActive(index)}
											activeMenu={activeMenu === index || routeInfo.some(item => item.to === location.pathname)}
										/>
									)
								})
							}
						</ul>
					</nav>
					<a
						className={classNames('collapse-button', {
							"active": isMenuCollapsed
						})}
						onClick={handleMenuCollapse}
					>
						<i className="zmdi zmdi-chevron-right left"/>
					</a>
				</div>
			</div>
		</Scrollbars>
	);
}

export default memo(Sidebar);