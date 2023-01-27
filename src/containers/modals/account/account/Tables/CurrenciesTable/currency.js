import React from 'react';

const Currency = ({
  code, name, unconfirmedUnits, decimals,
}) => (
  <tr>
    <td>{code}</td>
    <td>{name}</td>
    <td>{(unconfirmedUnits / (10 ** decimals)).toFixed(2)}</td>
  </tr>
);

export default Currency;
