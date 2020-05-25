import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const Currency = ({code, name, unconfirmedUnits, decimals}) => (
    <tr key={uuidv4()}>
        <td>{code}</td>
        <td>{name}</td>
        <td>{(unconfirmedUnits / Math.pow(10, decimals)).toFixed(2)}</td>
    </tr>
)

export default Currency;
