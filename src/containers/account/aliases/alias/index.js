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
        <td className="blue-link-text"><a>{props.aliasURI}</a></td>
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

        <td className="align-right">
            <div className="btn-box inline">
                <a
                    onClick={() => props.setBodyModalParamsAction('EDIT_ALIAS', props.alias)}
                    className="btn primary blue"
                >
                    Edit
                </a>
                <a
                    className="btn primary blue"
                    onClick={() => props.setBodyModalParamsAction('TRANSFER_ALIAS', props.alias)}
                >
                    Transfer
                </a>
                <a
                    className="btn primary blue"
                    onClick={() => props.setBodyModalParamsAction('SELL_ALIAS', props.alias)}
                >
                    Sell
                </a>
                {
                    (
                        props.priceATM &&
                        props.priceATM !== '0' &&
                        !props.buyer
                    ) &&
                    <a
                        className="btn primary blue"
                        onClick={() => props.setBodyModalParamsAction('CANCEL_SALE_ALIAS', props.alias)}
                    >
                        Cancel Sale
                    </a>
                }
                {
                    (
                        props.priceATM &&
                        props.priceATM !== '0' &&
                        typeof props.buyer !== "undefined"
                    ) &&
                    <a
                        className="btn primary blue"
                        onClick={() => props.setBodyModalParamsAction('CANCEL_SALE_ALIAS', props.alias)}
                    >
                        Cancel Sale
                    </a>
                }

                <a
                    className="btn primary"
                    onClick={() => props.setBodyModalParamsAction('DELETE_ALIAS', props.alias)}
                >
                    Delete</a>
            </div>
        </td>
    </tr>
);

const mapStateToProps = (state) => ({
    userAccount: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(null, mapDispatchToProps)(Alias);