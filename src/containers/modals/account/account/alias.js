import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const Alias = ({aliasName, aliasURI}) => (
    <tr key={uuidv4()}>
        <td>{aliasName}</td>
        <td>{aliasURI}</td>
    </tr>
)

export default Alias;
