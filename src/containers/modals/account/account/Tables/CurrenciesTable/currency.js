import React from 'react';
import { numberToLocaleString } from 'helpers/format';
import { bigIntDecimalsDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const Currency = ({
  code, name, unconfirmedUnits, decimals,
}) => (
  <tr>
    <td>{code}</td>
    <td>{name}</td>
    <td>{
      numberToLocaleString(bigIntFormat(bigIntDecimalsDivision(unconfirmedUnits, decimals)), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </td>
  </tr>
);

export default Currency;
