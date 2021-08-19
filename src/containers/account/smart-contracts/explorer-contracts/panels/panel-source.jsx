import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import TabulationBody from "../../../../components/tabulator/tabuator-body";
import TabContainer from "../../../../components/tabulator/tab-container";
import PanelContract from "../panels/panel-code";

const PanelSource = ({ source, contarcts }) => {
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
        <TabulationBody>
          <TabContainer sectionName={"Code"}>
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
          </TabContainer>

          {contarcts.length > 0 &&
            contarcts.map((contract) => (
              <TabContainer key={contract} sectionName={contract}>
                <PanelContract contract={contract} />
              </TabContainer>
            ))}
        </TabulationBody>
      </div>
    </div>
  );
};

export default PanelSource;
