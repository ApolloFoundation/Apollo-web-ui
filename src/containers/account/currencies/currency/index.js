import React from 'react';
import {Link} from 'react-router-dom';

const Currency = (props) => (
    <tr>
        <td className="blue-link-text">
            <a onClick={() => props.getTransaction(props.currency)}>
                {props.code}
            </a>
        </td>
        <td>{props.name}</td>
        <td className="blue-link-text"><a>{props.aliasURI}</a></td>
        <td className="align-right">{props.currentSupply / 100000000}</td>
        <td className="align-right">{props.maxSupply / 100000000}</td>
        <td className="align-right">
            <div className="btn-box inline">
                <Link to={"/exchange-booth/" + props.code} className="btn primary blue">Exchange</Link>
                <a className="btn primary blue">Reserve</a>
            </div>
        </td>
    </tr>
);

export default Currency;