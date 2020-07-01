/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react'
import classNames from 'classnames';

const InfoBox = (props) => (
    <div
        className={classNames({
            'attention-left': props.attentionLeft,
            'nowrap': props.nowrap,
            'info-box': true,
            'warning': props.warning,
            'danger': props.danger,
            'blue-info': props.info,
            'info': props.default,
            'mt': props.mt,
            'no-padding-top': props.onPaddingTop,
            'no-padding-on-the-sides': props.noPaddingOnTheSides
        }) + ` ${props.className}`}>
        {props.children}
    </div>
);

export default InfoBox;
