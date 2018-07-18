import React from 'react';

const Alias = (props) => (
    <tr>
        <td>{props.aliasName}</td>
        <td className="blue-link-text"><a>{props.aliasURI}</a></td>
        <td>Registered</td>
        <td className="align-right">
            <div className="btn-box inline"><a className="btn primary blue">Edit</a><a
                className="btn primary blue">Transfer</a><a
                className="btn primary blue">Sell</a><a
                className="btn primary">Delete</a>
            </div>
        </td>
    </tr>
);

export default Alias;