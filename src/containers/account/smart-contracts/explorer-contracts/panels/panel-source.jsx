import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";

const PanelSource = ({ source }) => {
  const { name, fuelPrice, fuelLimit, params, src } = source;
  return (
    <div className="transaction-table no-min-height transparent">
      <div className="transaction-table-body transparent mb-2">
        <div className="heading mb-3 pt-3">Source Information</div>
        <table className="w-100">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td>Fuel price</td>
              <td>{fuelPrice}</td>
            </tr>
            <tr>
              <td>Fuel limit</td>
              <td>{fuelLimit}</td>
            </tr>
            <tr>
              <td>Params</td>
              <td>{params}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div className="heading mb-3">Code</div>
        <AceEditor
          setOptions={{ useWorker: false }}
          mode="javascript"
          theme="tomorrow"
          fontSize={14}
          tabSize={2}
          width="100%"
          height="300px"
          readOnly={true}
          value={src}
        />
      </div>
    </div>
  );
};

export default PanelSource;
