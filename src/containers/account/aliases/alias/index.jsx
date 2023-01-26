/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {useDispatch} from 'react-redux';
import {setBodyModalParamsAction} from "modules/modals";

const Alias = (props) => {
  const dispatch = useDispatch();

  const handleEditAlias = () => dispatch(setBodyModalParamsAction('EDIT_ALIAS', props.alias));

  const handleTransferAlias = () => dispatch(setBodyModalParamsAction('TRANSFER_ALIAS', props.alias));

  const handleCancelSaleAliase = () => dispatch(setBodyModalParamsAction('CANCEL_SALE_ALIAS', props.alias));

  const handleSellAlias = () => dispatch(setBodyModalParamsAction('SELL_ALIAS', props.alias));

  const handleDeleteAlias = () => dispatch(setBodyModalParamsAction('DELETE_ALIAS', props.alias));

  return (
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
                    type='button'
                    onClick={handleEditAlias}
                    className="btn btn-default"
                >
                    Edit
                </button>
                <button
                    type='button'
                    className="btn btn-default"
                    onClick={handleTransferAlias}
                >
                    Transfer
                </button>
                {(
                    props.priceATM &&
                    props.priceATM !== '0' &&
                    (!props.buyer || typeof props.buyer !== "undefined")
                ) ? (
                    <button
                        type='button'
                        className="btn btn-default"
                        onClick={handleCancelSaleAliase}
                    >
                        Cancel Sale
                    </button>
                ) : (
                    <button
                        type='button'
                        className="btn btn-default"
                        onClick={handleSellAlias}
                    >
                        Sell
                    </button>
                )}
                <button
                    type='button'
                    className="btn btn-default"
                    onClick={handleDeleteAlias}
                >
                    Delete
                </button>
            </div>
        </td>
    </tr>
  );
}

export default Alias;
