import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import cn from 'classnames';

import ContentLoader from '../content-loader';

const SidebarContent = ({
  emptyMessage, baseUrl, data, element, location, Component, currentItem,
}) => (
  <>
    <div className="card scroll justify-content-start absolute h-100 sidebar-content">
      {!!data && data.length > 0 && data.map((el, index) => (
        <Link
          key={element}
          to={baseUrl + el[element]}
          className={cn({
            'chat-item': true,
            active: (location && location.pathname === baseUrl + el[element]) || currentItem === el[element],
          })}
        >
          <Component {...el} />
        </Link>
      ))}
      {data && data.length === 0
        ? (
          <p className="no-followed-polls">
            {emptyMessage}
          </p>
        ) : (
          <ContentLoader />
        )}
    </div>
  </>
);

export default withRouter(SidebarContent);
