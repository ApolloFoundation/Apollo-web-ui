import React from 'react';

const Currency = (props) => (
    <tr>
        <td className="blue-link-text">
            <a onClick={() => props.getTransaction(props.currency)}>
                {props.code}
            </a>
        </td>
        <td>{props.name}</td>
        <td className="blue-link-text"><a>{props.aliasURI}</a></td>
        <td className="align-right">{props.currentSupply}</td>
        <td className="align-right">{props.maxSupply}</td>
        <td className="align-right">
            <div className="btn-box inline">
                <a className="btn primary blue">Exchange</a>
                <a className="btn primary blue">Reserve</a>
            </div>
        </td>
    </tr>
);

export default Currency;