import React from 'react';

export const ExternalLink = ({to, label, icon}) => (
  <li className='active-menu'>
    <a className="text" target="_blank" href={to}>
      {label}
      <i className={`zmdi ${icon} left`}/>
    </a>
  </li>
);