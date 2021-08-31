import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import TabulationBody from "../../../../components/tabulator/tabuator-body";
import TabContainer from "../../../../components/tabulator/tab-container";
import PanelContract from "../panels/panel-code";

const PanelSource = ({ source, contracts }) => {

  return (
    <>
      <div className="heading mb-3 pt-3">Source Information</div>
      {/* <div className="row mb-3">
        <div className="col-md-6">
          <div className="transaction-table no-min-height transparent">
            <div className="transaction-table-body transparent mb-2">
              <table className="w-100">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{name}</td>
                  </tr>
                  <tr>
                    <td>Params</td>
                    <td>{params}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div></div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="transaction-table no-min-height transparent">
            <div className="transaction-table-body transparent mb-2">
              <table className="w-100">
                <tbody>
                  <tr>
                    <td>Fuel price</td>
                    <td>{fuelPrice}</td>
                  </tr>
                  <tr>
                    <td>Fuel limit</td>
                    <td>{fuelLimit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}
      <TabulationBody>

          {source && source?.src && (
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
              value={source.src}
            />
                    </TabContainer>
          )}


        {contracts.length > 0 &&
          contracts.map((contract) => (
            <TabContainer key={contract} sectionName={contract}>
              <PanelContract contract={contract} />
            </TabContainer>
          ))}
      </TabulationBody>
    </>
  );
};

export default PanelSource;
