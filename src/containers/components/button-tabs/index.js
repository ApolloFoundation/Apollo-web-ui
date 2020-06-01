/* eslint-disable react/button-has-type */
import React from 'react';
import cn from 'classnames';


export default function ButtonTabs(props) {
  const {
    onClick, className, tabs, isActive,
  } = props;

  return (
    <>
      {tabs.map(tab => (
        <button
          type="button"
          onClick={() => onClick(tab.id)}
          className={cn('form-tab', { active: isActive === tab.id }, className)}
        >
          <p>{tab.label}</p>
        </button>
      ))}
    </>
  );
}
