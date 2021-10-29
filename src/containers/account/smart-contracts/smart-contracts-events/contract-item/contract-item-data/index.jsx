import React from "react";
import styles from "./index.module.scss";

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
        <td className={styles.dataCell}>{handleData()}</td>
        <td>{props.signature}</td>
        <td>{props.transaction}</td>
        <td>{props.blockNumber}</td>
        <td>{props.address}</td>
      </tr>
    </>
  );
};

export default ContractItemSub;
