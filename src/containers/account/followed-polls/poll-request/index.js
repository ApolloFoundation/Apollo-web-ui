/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';

const PollRequest = props => (
    <tr>
        {
            props.startColorGradient &&
            props.stopColorGradient && 
            <td><div className="color-box" style={{background: 'linear-gradient(' + props.startColorGradient + ', ' + props.stopColorGradient + ')'}}/></td>

        }
        <td>{props.option}</td>
        <td className="align-right">{props.result > 100000000 ? props.result / 100000000 : props.result}</td>
        <td className="align-right">{props.weight > 100000000 ? props.weight / 100000000 : props.weight}</td>
    </tr>
);

export default PollRequest;