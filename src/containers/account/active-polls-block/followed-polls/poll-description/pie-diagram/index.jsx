/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Pie(props) {
  const {
    colors, data, hole, radius, stroke, strokeWidth, votes,
  } = props;
  const colorsLength = colors.length;
  const diameter = radius * 2;
  const d = null;
  let startAngle = 0;

  const sum = data.reduce((carry, current) => carry + current, 0);

  return (
    <svg
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter}`}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      {data.map((slice, sliceIndex) => {
        const nextAngle = startAngle;
        const angle = (slice / sum) * 360;
        const percent = (slice / sum) * 100;
        startAngle += angle;

        return (
          <Slice
            vote={votes[sliceIndex]}
            key={uuidv4()}
            value={slice}
            percent
            percentValue={percent.toFixed(1)}
            startAngle={nextAngle}
            angle={angle}
            radius={radius}
            hole={radius - hole}
            trueHole={hole}
            showLabel="label"
            stroke={stroke}
            strokeWidth={strokeWidth}
            startColorGradient={colors[sliceIndex].startColorGradient}
            stopColorGradient={colors[sliceIndex].stopColorGradient}
          />
        );
      })}
    </svg>
  );
}

function Slice() {

}

class Slice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      path: '',
      x: 0,
      y: 0,
    };
  }

  componentWillReceiveProps() {
    this.setState({ path: '' });
    this.animate();
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    const p = this.props;

    this.draw(p.angle);
  }

  draw(s) {
    const p = this.props; const path = []; let a; let b; let c; let
      step;

    step = p.angle / (37.5 / 2);

    if (s + step > p.angle) {
      s = p.angle;
    }

    // Get angle points
    a = getAnglePoint(p.startAngle, p.startAngle + s, p.radius, p.radius, p.radius);
    b = getAnglePoint(p.startAngle, p.startAngle + s, p.radius - p.hole, p.radius, p.radius);

    path.push(`M${a.x1},${a.y1}`);
    path.push(`A${p.radius},${p.radius} 0 ${s > 180 ? 1 : 0},1 ${a.x2},${s === 360 ? 149 : a.y2}`);
    path.push(`L${b.x2},${b.y2}`);
    path.push(`A${p.radius - p.hole},${p.radius - p.hole} 0 ${s > 180 ? 1 : 0},0 ${b.x1},${b.y1}`);

    // Close
    path.push('Z');

    this.setState({ path: path.join(' ') });

    if (p.showLabel) {
      c = getAnglePoint(p.startAngle, p.startAngle + (p.angle / 2), (p.radius / 2 + p.trueHole / 2), p.radius, p.radius);

      this.setState({
        x: c.x2,
        y: c.y2,
      });
    }
  }

  render() {
    const id = uuidv4();
    return (
      <g overflow="hidden">
        <linearGradient id={id}>
          <stop stopColor={this.props.startColorGradient} />
          <stop offset="100%" stopColor={this.props.stopColorGradient} />
        </linearGradient>
        <path
          d={this.state.path}
          fill={`url(#${id.toString()})`}
          stroke="white"
          strokeWidth={3}
        />
        {this.props.showLabel && this.props.percentValue > 5
          ? (
            <text className="displayedText" x={this.state.x} y={this.state.y} fill="#fff" textAnchor="middle">
              {this.props.percent ? `${this.props.percentValue}%` : this.props.value}
            </text>
          )

          : null}
      </g>
    );
  }
}

function getAnglePoint(startAngle, endAngle, radius, x, y) {
  let x1; let y1; let x2; let
    y2;

  x1 = x + radius * Math.cos(Math.PI * startAngle / 180);
  y1 = y + radius * Math.sin(Math.PI * startAngle / 180);
  x2 = x + radius * Math.cos(Math.PI * endAngle / 180);
  y2 = y + radius * Math.sin(Math.PI * endAngle / 180);

  return {
    x1, y1, x2, y2,
  };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
