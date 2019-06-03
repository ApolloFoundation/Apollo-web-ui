import React from 'react';
import uuid from 'uuid';

const Alias = ({aliasName, aliasURI}) => (
    <tr key={uuid()}>
        <td>{aliasName}</td>
        <td>{aliasURI}</td>
    </tr>
)

export default Alias;