/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {ONE_APL} from '../../../../constants';
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
        {((props.priceATM && props.priceATM !== '0' && !props.buyer)
        || (props.buyer && props.account === props.buyer))
        && (<td className="align-right unset-text-overflow">
            <div className="btn-box inline">
                <button
                    type={'button'}
                    onClick={() => props.setBodyModalParamsAction('BUY_ALIAS', {...props, priceATM: props.priceATM / ONE_APL})}
                    className="btn btn-default"
                >
                    Buy alias
                </button>
            </div>
        </td>)
        }
    </tr>
);

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alias);
