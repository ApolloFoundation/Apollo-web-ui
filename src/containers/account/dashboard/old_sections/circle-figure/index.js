/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import CircularProgressbar from 'react-circular-progressbar';
import './CircleFigure.scss';
import classNames from "classnames";

class CircleFigure extends React.Component {
    constructor(props){
        super(props);

        this._uid = uuidv4();
    }

    render (){
        return (
            <div className="figure" id={this._uid}>
                <CircularProgressbar
                    className={classNames({
                        'Bitcoin': this.props.index === 0,
                        'Creed':  this.props.index === 1,
                        'MarioCoin': this.props.index === 2
                    })}
                    percentage={this.props.percentage}
                    text={`${this.props.percentage}%`}
                    styles={{
                        path: { stroke: `rgba(62, 152, 199, ${this.props.percentage / 100})` },
                        text: { fill: '#f88', fontSize: '16px' },
                    }}
                    style={{
                        margin: 0
                    }}
                    strokeWidth={14}
                />
            </div>
        );
    }
}

export default CircleFigure;
