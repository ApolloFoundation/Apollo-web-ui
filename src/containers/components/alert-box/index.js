/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import classNames from "classnames";
import { getModalsSelector } from '../../../selectors';
import './AlertBox.css';

const AlertBox = () => {
    const { alertMessage, alertStatus } = useSelector(getModalsSelector, shallowEqual);
    return (
        <div className="alert-box">
            {
                alertStatus &&
                <div
                    className={classNames({
                        'info-box': true,
                        'success': alertStatus === 'success'
                    })}>
                    <p>
                        {alertMessage}
                    </p>
                </div>
            }
        </div>
    );
}

export default AlertBox;