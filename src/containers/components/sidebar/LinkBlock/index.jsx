import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { ModalLink } from '../ModalLink';

export const LinkBlock = ({ routeItemInfo, activeMenu, onActiveClick }) => {
  if (!activeMenu) {
    return (
      <li className='active-menu'>
        <span className="text" onClick={onActiveClick}>
          {routeItemInfo[0].label}
          <i className={classNames('zmdi left', {[routeItemInfo[0].icon]: routeItemInfo[0].icon})} />
        </span>
      </li>  
    );
  }

  return (
    <li className='active-menu open'>
        {routeItemInfo.map(item => {
          if (item.modalType) {
            return <ModalLink key={item.id} {...item} />
          }

          return (
            <NavLink
              key={item.to + item.label}
              to={item.to}
              exact
              className="text"
              activeClassName="active"
            >
              {item.label}<i className={classNames('zmdi left', {[item.icon]: item?.icon})} />
            </NavLink>
          )
        })}
    </li>
  );
}

