/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { convertHexToUint } from "../../../../helpers/converters";

const TableItemToken = ({ name, from, signature, amount }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{signature.substr(-12)}</td>
      <td>{from.value}</td>
      <td className="align-right">
        {Number(convertHexToUint(amount.value)).toLocaleString("en", {
          useGrouping: true,
        })}
      </td>
    </tr>
  );
};
export default TableItemToken;
