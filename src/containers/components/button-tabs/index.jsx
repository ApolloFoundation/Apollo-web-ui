import React from 'react';
import cn from 'classnames';

import './style.scss';

export default function ButtonTabs(props) {
  const {
    onClick, className, tabs, isActive,
  } = props;

  return (
    <div className="form-tab-nav-box">
      {tabs.map(tab => (
        <button
          type="button"
          onClick={() => onClick(tab.id)}
          className={cn('form-tab', { active: isActive === tab.id }, className)}
        >
          <p>
            {!!tab.icon && <i className={`zmdi zmdi-${tab.icon}`} />}
            {tab.label}
          </p>
        </button>
      ))}
    </div>
  );
}
