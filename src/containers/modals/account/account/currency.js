import React from 'react';
import uuid from 'uuid';

const Currency = ({code, name, unconfirmedUnits, decimals}) => (
    <tr key={uuid()}>
        <td>{code}</td>
        <td>{name}</td>
        <td>{(unconfirmedUnits / Math.pow(10, decimals)).toFixed(2)}</td>
    </tr>
)

export default Currency;