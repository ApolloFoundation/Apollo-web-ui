import React from 'react';

const SidebarCurrency = el => (
  <div className="chat-box-item">
    <div className="chat-box-rs">
      {el.name}
    </div>
    <div className="chat-date">
      Current Supply
      {' '}
      {el.currentSupply / (10 ** el.decimals)}
    </div>
  </div>
);

export default SidebarCurrency;
