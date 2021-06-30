/** ****************************************************************************
 * Copyright © 2021 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabulationBody from "../../components/tabulator/tabuator-body";
import TabContaier from "../../components/tabulator/tab-container";
import TabPanelOverview from "./tab-panel-overview";
import TabMethodPanel from "./tab-panel-method";
import { getSmcSpecification } from "../../../actions/contracts";

const SmartContractsExplorer = ({ closeModal }) => {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modals.modalData);

  const [specificationsList, setSpecificationsList] = useState([]);
  const [overviewInfo, setOverviewInfo] = useState([]);
  const { address } = modalData;
  
  useEffect(() => {
    getContractSpecification(address);
  }, [address]);

  const getContractSpecification = useCallback(
    async (address) => {
      const specifications = await dispatch(getSmcSpecification(address));
      if (specifications) {
        setSpecificationsList(specifications.members);
        setOverviewInfo(specifications.overview);
      }
    },
    [dispatch]
  );

  const getTabPanel = (type) =>
    specificationsList.map((item) => item.stateMutability === type && (
        <TabMethodPanel address={address} item={item} type={type} />
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
                <TabPanelOverview overview={overviewInfo} />
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
