/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from "../../../../modules/modals";

const Alias = (props) => (
    <tr>
        <td>{props.aliasName}</td>
        <td>{props.aliasURI}</td>
        {
            props.priceATM &&
            props.priceATM === '0' &&
            props.userAccount === props.buyer &&
            <td>CANCELLING SALE</td>
        }
        {
            props.priceATM &&
            props.priceATM === '0' &&
            props.userAccount !== props.buyer &&
            <td>TRANSFER IN PROGRESS</td>
        }
        {
            props.priceATM &&
            props.priceATM !== '0' &&
            typeof props.buyer !== "undefined" &&
            <td>FOR SALE (DIRECT)</td>
        }
        {
            props.priceATM &&
            props.priceATM !== '0' &&
            !props.buyer &&
            <td>FOR SALE (INDIRECT)</td>
        }
        {
            !props.priceATM &&
            <td>REGISTERED</td>
        }

        <td className="align-right unset-text-overflow">
            <div className="btn-box inline">
                <button
                    type={'button'}
                    onClick={() => props.setBodyModalParamsAction('EDIT_ALIAS', props.alias)}
                    className="btn btn-default"
                >
                    Edit
                </button>
                <button
                    type={'button'}
                    className="btn btn-default"
                    onClick={() => props.setBodyModalParamsAction('TRANSFER_ALIAS', props.alias)}
                >
                    Transfer
                </button>
                {(
                    props.priceATM &&
                    props.priceATM !== '0' &&
                    (!props.buyer || typeof props.buyer !== "undefined")
                ) ? (
                    <button
                        type={'button'}
                        className="btn btn-default"
                        onClick={() => props.setBodyModalParamsAction('CANCEL_SALE_ALIAS', props.alias)}
                    >
                        Cancel Sale
                    </button>
                ) : (
                    <button
                        type={'button'}
                        className="btn btn-default"
                        onClick={() => props.setBodyModalParamsAction('SELL_ALIAS', props.alias)}
                    >
                        Sell
                    </button>
                )}
                <button
                    type={'button'}
                    className="btn btn-default"
                    onClick={() => props.setBodyModalParamsAction('DELETE_ALIAS', props.alias)}
                >
                    Delete
                </button>
            </div>
        </td>
    </tr>
);

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(null, mapDispatchToProps)(Alias);