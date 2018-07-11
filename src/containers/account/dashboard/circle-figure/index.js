import React from 'react';
import uuid from 'uuid';
import CircularProgressbar from 'react-circular-progressbar';
import './CircleFigure.css';

class CircleFigure extends React.Component {
    constructor(props){
        super(props);

        this._uid = uuid();
    }

    render (){
        return (
            <div className="figure" id={this._uid}>
                <CircularProgressbar
                    percentage={this.props.percentage}
                    text={`${this.props.percentage}%`}
                    styles={{
                        path: { stroke: `rgba(62, 152, 199, ${this.props.percentage / 100})` },
                        text: { fill: '#f88', fontSize: '16px' },
                    }}
                    className={this.props.type}
                    strokeWidth={14}
                />
            </div>
        );
    }
}

export default CircleFigure;