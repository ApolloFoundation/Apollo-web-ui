import React from 'react';

const Alias = (props) => (
    <tr>
        <td>{props.aliasName}</td>
        <td className="blue-link-text"><a>{props.aliasURI}</a></td>
        <td>Registered</td>
        <td className="align-right">
            <div className="btn-box inline">
                <a
                    onClick={props.editAlias}
                    className="btn primary blue"
                >
                    Edit
                </a>
                <a
                    className="btn primary blue"
                    onClick={props.transferAlias}
                >
                    Transfer</a>
                <a
                    className="btn primary blue"
                    onClick={props.sellAlias}
                >
                    Sell</a>
                <a
                    className="btn primary"
                    onClick={props.deleteAlias}
                >
                    Delete</a>
            </div>
        </td>
    </tr>
);

export default Alias;