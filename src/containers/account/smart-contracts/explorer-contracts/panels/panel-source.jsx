import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import TabulationBody from "../../../../components/tabulator/tabuator-body";
import TabContainer from "../../../../components/tabulator/tab-container";
import PanelContract from "../panels/panel-code";
import { getSmcSourceInfo } from "../../../../../actions/contracts";

const PanelSource = ({ contracts, address }) => {
  const dispatch = useDispatch();

  const [sourceInfo, setSourceInfo] = useState({});

  useEffect(() => {
    getSourceSpecification(address);
  }, [address]);

  const getSourceSpecification = useCallback(
    async (address) => {
      const source = await dispatch(getSmcSourceInfo(address));
      if (source) {
        setSourceInfo(source.contracts[0]);
      }
    },
    [dispatch, setSourceInfo]
  );

  return (
    <>
      <div className="heading mb-3 pt-3">Source Information</div>
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="transaction-table no-min-height transparent">
            <div className="transaction-table-body transparent mb-2">
              <table className="w-100">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{sourceInfo.name}</td>
                  </tr>
                  <tr>
                    <td>Params</td>
                    <td>{sourceInfo.params}</td>
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
                    <td>{sourceInfo.fuelPrice}</td>
                  </tr>
                  <tr>
                    <td>Fuel limit</td>
                    <td>{sourceInfo.fuelLimit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <TabulationBody>
        <TabContainer sectionName={"Code"}>
          {sourceInfo?.src && (
            <AceEditor
              setOptions={{ useWorker: false }}
              mode="javascript"
              theme="tomorrow"
              fontSize={14}
              tabSize={2}
              width="100%"
              height="300px"
              readOnly={true}
              value={sourceInfo.src}
            />
          )}
        </TabContainer>

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
