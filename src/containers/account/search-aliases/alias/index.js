/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import { getAccountSelector, getDecimalsSelector } from 'selectors';
import {setBodyModalParamsAction} from "modules/modals";

const Alias = (props) => {
    const handleBuyAlias = () => props.setBodyModalParamsAction('BUY_ALIAS', props);

    return (
        <tr>
            <td>{props.aliasName}</td>
            <td>{props.aliasURI}</td>
            <td>
                {
                    (props.priceATM &&
                    props.priceATM === '0' &&
                    props.userAccount === props.buyer) && 'CANCELLING SALE'
                }
                {
                    (props.priceATM &&
                    props.priceATM === '0' &&
                    props.userAccount !== props.buyer) &&
                    'TRANSFER IN PROGRESS'
                }
                {
                    (props.priceATM &&
                    props.priceATM !== '0' &&
                    typeof props.buyer !== "undefined") &&
                    'FOR SALE (DIRECT)'
                }
                {
                    (props.priceATM &&
                    props.priceATM !== '0' &&
                    !props.buyer) &&
                    'FOR SALE (INDIRECT)'
                }
                {
                    !props.priceATM &&
                'REGISTERED'
                }
            </td>
            <td>{props.priceATM ? (props.priceATM / props.decimals) : ''}</td>
            <td className="align-right unset-text-overflow">
                {((props.priceATM && props.priceATM !== '0' && !props.buyer)
                    || (props.buyer && props.account === props.buyer)) && (
                        <div className="btn-box inline">
                            <button
                                type='button'
                                onClick={handleBuyAlias}
                                className="btn btn-default"
                            >
                                Buy alias
                            </button>
                        </div>
                    )}
            </td>
        </tr>
    );
}

const mapStateToProps = state => ({
    account: getAccountSelector(state),
    decimals: getDecimalsSelector(state),
});

const mapDispatchToProps = {
    setBodyModalParamsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Alias);
