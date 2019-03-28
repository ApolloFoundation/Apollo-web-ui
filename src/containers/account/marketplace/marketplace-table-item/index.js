/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

const MarketplaceTableItem = (props) => (
    <tr>
        <td className="blue-link-text"><a onClick={() => props.setBodyModalParamsAction("INFO_TRANSACTION", props.goods)}>{props.name}</a></td>
        <td className="align-right"><a>{props.quantity}</a></td>
        <td className="align-right">{Math.floor(props.priceATM / 100000000).toLocaleString('it')} APL</td>
        <td className="align-right">
            <div className="btn-box inline">
                <a
                    onClick={() => props.setBodyModalParamsAction('CHANGE_PRICE', props.goods)}
                    className="btn primary blue"
                >
                    Change Price
                </a>
                <a
                    onClick={() => props.setBodyModalParamsAction('CHANGE_QUANTITY', props.goods)}
                    className="btn primary blue"
                >
                    Change QTY
                </a>
                <a
                    onClick={() => props.setBodyModalParamsAction('DELETE_GOODS', props.goods)}
                    className="btn primary"
                >
                    Delete
                </a>
            </div>
        </td>
    </tr>
);

export default connect(null, mapDispatchToProps)(MarketplaceTableItem);