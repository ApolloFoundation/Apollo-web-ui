import React from "react";

const ContractItemSub = (props) => {
  return (
    <>
      <tr>
        <td>{props.event}</td>
        <td>{props.data}</td>
        <td>{props.signature}</td>
        <td>{props.transactionHash}</td>
        <td>{props.blockHash}</td>
        <td>{props.blockNumber}</td>
        <td>{props.address}</td>
      </tr>
    </>
  );
};

export default ContractItemSub;
