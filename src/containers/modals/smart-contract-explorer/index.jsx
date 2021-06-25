/** ****************************************************************************
 * Copyright © 2021 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { useSelector } from "react-redux";
import TabulationBody from "../../components/tabulator/tabuator-body";
import TabContaier from "../../components/tabulator/tab-container";
import TabPanelOverview from "./tab-panel-overview";
import TabMethodPanel from "./tab-panel-method";

import { list } from "./list";

const SmartContractsExplorer = ({ closeModal }) => {
  const { members, overview } = list;
  const modalData = useSelector((state) => state.modals.modalData);
  const { address } = modalData;

  const getTabPanel = (type) =>  members.map((item) => item.stateMutability === type && (
      <TabMethodPanel address={address} item={item} />
    )
  );

  return (
    <div className="modal-box x-wide">
      <div className="form-group-app media-tab">
        <div className="modal-form">
          <div className="form-group-app media-tab">
            <button onClick={closeModal} className="exit pointer">
              <i className="zmdi zmdi-close" />
            </button>
            <TabulationBody>
              <TabContaier sectionName={"Overview"}>
                <TabPanelOverview overview={overview} />
              </TabContaier>
              <TabContaier sectionName={"Read method"}>
                {getTabPanel("view")}
              </TabContaier>
              <TabContaier sectionName={"Write method"}>
                {getTabPanel("nonpayable")}
              </TabContaier>
            </TabulationBody>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SmartContractsExplorer;
