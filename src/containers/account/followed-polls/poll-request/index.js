/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';
import React from 'react';
import {connect} from 'react-redux';
import { getDecimalsSelector } from 'selectors';

const PollRequest = props => (
  <tr>
    {
      props.startColorGradient &&
      props.stopColorGradient &&
      <td><div className="color-box" style={{background: 'linear-gradient(' + props.startColorGradient + ', ' + props.stopColorGradient + ')'}}/></td>
    }
    <td>{props.option}</td>
    <td className="align-right">{props.result > props.decimals ? bigIntFormat(bigIntDivision(props.result, props.decimals)) : props.result}</td>
    <td className="align-right">{props.weight > props.decimals ? bigIntFormat(bigIntDivision(props.weight, props.decimals)) : props.weight}</td>
  </tr>
);

const mapStateToProps = state => ({
  decimals: getDecimalsSelector(state),
});

export default connect(mapStateToProps, null)(PollRequest);
