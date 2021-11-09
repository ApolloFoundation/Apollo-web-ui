import React from "react";

const ContractItemSub = (props) => {

  const handleData = () => {
    const data = JSON.parse(props.data);
    return Object
      .keys(data)
      .reduce((acc, key) => acc += `${key}: ${data[key].value};  `, '');
  }

  return (
    <>
      <tr>
        <td>{props.event}</td>
        <td className="white-space-pre-wrap">{handleData()}</td>
        <td>{props.signature}</td>
        <td>{props.transaction}</td>
        <td>{props.blockNumber}</td>
        <td>{props.address}</td>
      </tr>
    </>
  );
};

export default ContractItemSub;
