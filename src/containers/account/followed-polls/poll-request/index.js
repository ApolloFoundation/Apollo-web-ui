/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {ONE_APL} from '../../../../constants';

const PollRequest = props => (
    <tr>
        {
            props.startColorGradient &&
            props.stopColorGradient &&
            <td><div className="color-box" style={{background: 'linear-gradient(' + props.startColorGradient + ', ' + props.stopColorGradient + ')'}}/></td>

        }
        <td>{props.option}</td>
        <td className="align-right">{props.result > ONE_APL ? props.result / ONE_APL : props.result}</td>
        <td className="align-right">{props.weight > ONE_APL ? props.weight / ONE_APL : props.weight}</td>
    </tr>
);

export default PollRequest;
