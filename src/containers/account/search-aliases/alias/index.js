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
                            onClick={() => props.setBodyModalParamsAction('BUY_ALIAS', props)}
                            className="btn btn-default"
                        >
                            Buy alias
                        </button>
                    </div>
                )}
        </td>
    </tr>
);

const mapStateToProps = state => ({
    account: state.account.account,
    decimals: state.account.decimals,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alias);
