/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getSmcSpecification } from "../../../../actions/contracts";
import { convertToToken } from "../../../../helpers/converters";
import Button from "../../../components/button";

const TableItemMyTokens = ({
  address,
  symbol,
  signature,
  balance,
  id,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleActionModal = async (type) => {
    const specifInfo = await dispatch(getSmcSpecification(address));
    if (specifInfo) {
      const smcInfo = specifInfo.members.reduce(
        (ac, { ["name"]: x, ...rest }) => ((ac[x] = rest.value), ac),
        {}
      );
      dispatch(setBodyModalParamsAction(type, { address, smcInfo }));
    }
   };

  const handleContractInfo = () => {
    history.push(`/smart-contracts/explorer/contract/${address}`);
  };

  const handleTokenInfo = () => {
    history.push(`/smart-contracts/explorer/token/${address}`);
  };

  return (
    <tr>
      <td>
        <Button color="blue-link" onClick={handleContractInfo} name={address} />
      </td>
      <td>
        <Button color="blue-link" onClick={handleTokenInfo} name={symbol} />
      </td>
      <td className="align-right">
        {convertToToken(balance, 8, true)}
      </td>
      <td className="align-right">{signature.substr(-12)}</td>
      <td className="align-right">
        <div className="btn-box inline">
          <Button
            onClick={()=> handleActionModal("SMC_TRANSFER")}
            color="green"
            size="sm"
            id={`button-transfer-${id}`}
            name="Transfer"
          />
          <Button
            onClick={()=> handleActionModal("SMC_BUY")}
            color="green"
            size="sm"
            id={`button-buy-${id}`}
            name="Buy"
          />
        </div>
      </td>
    </tr>
  );
};
export default TableItemMyTokens;
