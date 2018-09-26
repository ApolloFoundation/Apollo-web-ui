/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react'
import classNames from 'classnames';

const InfoBox = (props) => (
    <div
        className={classNames({
            'info-box': true,
            'danger': props.danger,
            'blue-info': props.info,
            'info': props.default,
            'mt': props.mt
        })}>
        <p>
            {props.children}
        </p>
    </div>
)

export default InfoBox;