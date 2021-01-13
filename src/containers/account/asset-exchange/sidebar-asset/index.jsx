import React from 'react';

const SidebatAsset = el => (
  <div className="chat-box-item">
    <div className="chat-box-rs">
      {el ? el.name : ''}
    </div>
    <div className="chat-date">
      Quantity:&nbsp;
      {(el.quantityATU / (10 ** el.decimals)).toFixed(el.decimals)}
    </div>
  </div>
);

export default SidebatAsset;
