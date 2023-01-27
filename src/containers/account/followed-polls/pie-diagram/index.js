/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const Pie = (props) => {
    let hole = props.hole,
        radius = props.radius,
        diameter = radius * 2,
        sum, startAngle;

    sum = props.data.reduce(function (carry, current) { return carry + current }, 0);
    startAngle = 0;

    return (
        <svg
            width={ diameter }
            height={ diameter }
            viewBox={ '0 0 ' + diameter + ' ' + diameter }
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
        >
            { props.data.map((slice, sliceIndex) => {
                let angle, nextAngle, percent;

                nextAngle = startAngle;
                angle = (slice / sum) * 360;
                percent = (slice / sum) * 100;
                startAngle += angle;

                return <Slice
                    key={props.votes[sliceIndex]}
                    vote={props.votes[sliceIndex]}
                    value={ slice }
                    percent
                    percentValue={ percent.toFixed(1) }
                    startAngle={ nextAngle }
                    angle={ angle }
                    radius={ radius }
                    hole={ radius - hole }
                    trueHole={ hole }
                    showLabel='label'
                    stroke={props.stroke }
                    strokeWidth={props.strokeWidth }
                    startColorGradient={props.colors[sliceIndex].startColorGradient}
                    stopColorGradient={props.colors[sliceIndex].stopColorGradient}
                />
            }) }
        </svg>
    );
}


const Slice = (props) => {
    const [state, setState] = useState({
        path: '',
        x: 0,
        y: 0
    });

    const animate = useCallback(() => {
        draw(props.angle);
    }, [props.angle, draw]);

    const draw = useCallback((s) => {
        const { startAngle, radius, hole, angle, showLabel, trueHole } = props;
        let path = [], a, b, c, step;

        step = angle / (37.5 / 2);

        if (s + step > angle) {
            s = angle;
        }

        // Get angle points
        a = getAnglePoint(startAngle, startAngle + s, radius, radius, radius);
        b = getAnglePoint(startAngle, startAngle + s, radius - hole, radius, radius);

        path.push('M' + a.x1 + ',' + a.y1);
        path.push('A' + radius + ',' + radius + ' 0 ' + (s > 180 ? 1 : 0) + ',1 ' + a.x2 + ',' + (s === 360 ? 149 : a.y2));
        path.push('L' + b.x2 + ',' + b.y2);
        path.push('A' + (radius - hole) + ',' + (radius - hole) + ' 0 ' + (s > 180 ? 1 : 0) + ',0 ' + b.x1 + ',' + b.y1);

        // Close
        path.push('Z');

        setState(prevState => ({
            ...prevState,
            path: path.join(' ')
        }));

        if (showLabel) {
            c = getAnglePoint(startAngle, startAngle + (angle / 2), (radius / 2 + trueHole / 2), radius, radius);

            setState(prevProps => ({
                ...prevProps,
                x: c.x2,
                y: c.y2
            }));
        }
    }, [props.startAngle, props.radius, props.hole, props.angle, props.showLabel, props.trueHole]);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            path: '',
        }));
        animate();
    }, [animate]);

    const id = uuidv4();
    return (
        <g overflow="hidden">
            <linearGradient id={id}>
                <stop stopColor={props.startColorGradient}/>
                <stop offset='100%' stopColor={props.stopColorGradient}/>
            </linearGradient>
            <path
                d={state.path}
                fill={'url(#' + id.toString() + ')'}
                stroke='white'
                strokeWidth={3}
            />
            {props.showLabel && props.percentValue > 5 ?
                <text className="displayedText" x={state.x} y={state.y} fill="#fff" textAnchor="middle">
                    {props.percent ? props.percentValue + '%' : props.value}
                </text>

                : null}
        </g>
    );
}

function getAnglePoint(startAngle, endAngle, radius, x, y) {
    var x1, y1, x2, y2;

    x1 = x + radius * Math.cos(Math.PI * startAngle / 180);
    y1 = y + radius * Math.sin(Math.PI * startAngle / 180);
    x2 = x + radius * Math.cos(Math.PI * endAngle / 180);
    y2 = y + radius * Math.sin(Math.PI * endAngle / 180);

    return { x1, y1, x2, y2 };
}

export default Pie;
