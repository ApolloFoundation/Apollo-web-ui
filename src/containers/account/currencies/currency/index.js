/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";

class Currency extends React.Component {
    render() {
        return (
            <tr>
                <td className="blue-link-text">
                    <a onClick={() => this.props.getTransaction(this.props.currency)}>
                        {this.props.code}
                    </a>
                </td>
                <td>{this.props.name}</td>
                <td className="blue-link-text"><a>{this.props.aliasURI}</a></td>
                <td className="align-right">{this.props.currentSupply / Math.pow(10, this.props.decimals)}</td>
                <td className="align-right">{this.props.maxSupply / Math.pow(10, this.props.decimals)}</td>
                <td className="align-right">
                    <div className="btn-box inline">
                        <Link to={"/exchange-booth/" + this.props.code} className="btn primary blue">Exchange</Link>
                        {
                            this.props.types.includes('RESERVABLE') &&
                            <a onClick={() => this.props.setBodyModalParamsAction('RESERVE_CURRENCY', this.props)} className="btn primary default">Reserve</a>
                        }
                    </div>
                </td>
            </tr>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),

})

export default connect(null, mapDispatchToProps)(Currency);