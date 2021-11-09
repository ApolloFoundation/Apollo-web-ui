/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import {convertToToken} from "../../../../helpers/converters"
const TableItemToken = ({
  name,
  from,
  signature,
  amount
}) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{signature.substr(-12)}</td>
      <td>{from.value}</td>
      <td className="align-right">{convertToToken(amount.value)}</td>
    </tr>
  );
};
export default TableItemToken;
