/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';

const PollRequest = props => (
  <tr>
    {
      props.startColorGradient &&
      props.stopColorGradient &&
      <td><div className="color-box" style={{background: 'linear-gradient(' + props.startColorGradient + ', ' + props.stopColorGradient + ')'}}/></td>
    }
    <td>{props.option}</td>
    <td className="align-right">{props.result > props.decimals ? props.result / props.decimals : props.result}</td>
    <td className="align-right">{props.weight > props.decimals ? props.weight / props.decimals : props.weight}</td>
  </tr>
);

const mapStateToProps = state => ({
  decimals: state.account.decimals,
});

export default connect(mapStateToProps, null)(PollRequest);
