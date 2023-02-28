/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom'
import {setBodyModalParamsAction} from "modules/modals";
import {getOrderInfoAction} from "actions/open-orders";
import { getDecimalsSelector } from 'selectors';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

const OrderItem = (props) => {
    const dispatch = useDispatch();
    const currentCoinDecimals = useSelector(getDecimalsSelector);
    const [orderInfo, setOrderInfo] = useState({});

    const handleCancelOrderModal = () => {
        dispatch(setBodyModalParamsAction("CANCEL_ORDER", {...props, type: props.type, currentCoinDecimals }))
    }

    const getOrderInfo = useCallback(() => {
        dispatch(getOrderInfoAction(props.asset))
            .then(res => setOrderInfo(res ?? {}));
    }, [props.asset, dispatch]);

    useEffect(() => {
        getOrderInfo();
    }, [getOrderInfo]);

    const price = useMemo(() => {
        const num1 = bigIntDivision(bigIntMultiply(props.quantityATU, props.priceATM), currentCoinDecimals);
        const num2 = bigIntDecimalsDivision(props.quantityATU, props.decimals);
        return bigIntDivision(num1, num2);
    }, [props.quantityATU, props.priceATM, currentCoinDecimals, props.quantityATU, props.decimals]);

    const total = useMemo(() => bigIntDivision(bigIntMultiply(props.quantityATU, props.priceATM), currentCoinDecimals),
        [props.quantityATU, props.priceATM, currentCoinDecimals]
    );

    return (
        <tr>
            <td className="align-left blue-link-text">
                <Link to={`/asset-exchange/${orderInfo.asset}`}>
                    {orderInfo.name}
                </Link>
            </td>
            <td className="align-left">
                {bigIntFormat(bigIntDivision(bigIntDecimalsDivision(props.quantityATU, props.decimals)))}
            </td>
            <td>{bigIntFormat(price)}</td>
            <td>{bigIntFormat(total)}</td>
            <td className="align-right">
                <div className="btn-box inline">
                    <button
                        type='button'
                        className='btn btn-default'
                        onClick={handleCancelOrderModal}
                    >
                        Cancel
                    </button>
                </div>

            </td>
        </tr>
    );
}

export default OrderItem;
