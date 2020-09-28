/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { useSelector } from 'react-redux';

const PollRequest = ({
  startColorGradient, stopColorGradient, option, result, weight,
}) => {
  const { decimals } = useSelector(state => state.account);

  return (
    <tr>
      {startColorGradient && stopColorGradient && (
        <td>
          <div className="color-box" style={{ background: `linear-gradient(${startColorGradient}, ${stopColorGradient})` }} />
        </td>
      )}
      <td>{option}</td>
      <td className="align-right">{result > decimals ? result / decimals : result}</td>
      <td className="align-right">{weight > decimals ? weight / decimals : weight}</td>
    </tr>
  );
};

export default PollRequest;
