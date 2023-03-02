import React from 'react';
import { bigIntDecimalsDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const SidebatAsset = el => (
  <div className="chat-box-item">
    <div className="chat-box-rs">
      {el ? el.name : ''}
    </div>
    <div className="chat-date">
      {`Quantity: ${bigIntFormat(bigIntDecimalsDivision(el.quantityATU, el.decimals))}`}
    </div>
  </div>
);

export default SidebatAsset;
