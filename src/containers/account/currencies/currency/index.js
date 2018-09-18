import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),

})

const Currency = (props) => (
    <tr>
        <td className="blue-link-text">
            <a onClick={() => props.getTransaction(props.currency)}>
                {props.code}
            </a>
        </td>
        <td>{props.name}</td>
        <td className="blue-link-text"><a>{props.aliasURI}</a></td>
        <td className="align-right">{props.currentSupply / Math.pow(10, props.decimals)}</td>
        <td className="align-right">{props.maxSupply / Math.pow(10, props.decimals)}</td>
        <td className="align-right">
            <div className="btn-box inline">
                <Link to={"/exchange-booth/" + props.code} className="btn primary blue">Exchange</Link>
                <a onClick={() => props.setBodyModalParamsAction('RESERVE_CURRENCY', null)} className="btn primary blue">Reserve</a>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(Currency);