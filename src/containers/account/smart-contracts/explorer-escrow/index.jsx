/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSmcSpecification } from "../../../../actions/contracts";
import SiteHeader from "../../../components/site-header";
import ContentLoader from "../../../components/content-loader";
import TabulationBody from "../../../components/tabulator/tabuator-body";
import TabContaier from "../../../components/tabulator/tab-container";
import PanelMethod from "../panels/panel-method";
import PanelSource from "../panels/panel-source";
import PanelOverview from "../panels/panel-overview";

const ExplorerEscrow = (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;

  const [specificationsList, setSpecificationsList] = useState({});
  const [contractsList, setContractsList] = useState([]);
  const [overviewInfo, setOverviewInfo] = useState([]);
  const [isLoadingPanels, setIsLoadingPanels] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  
  useEffect(() => {
    getContractSpecification(id);
  }, [id]);

  const getContractSpecification = useCallback(
    async (id) => {
      const specifications = await dispatch(getSmcSpecification(id));
      if (specifications) {
        const { members, overview, inheritedContracts } = specifications;
        const membersList = members.reduce(
          (acc, item) => {
            if (item.type === "FUNCTION") {
              if (item.stateMutability === "view") {
                acc.readList.push(item);
              } else {
                acc.writeList.push(item);
              }
            }
            return acc;
          },
          { readList: [], writeList: [] }
        );

        setIsLoadingPanels(false);
        setOverviewInfo(overview);
        setSpecificationsList(membersList);
        setContractsList(inheritedContracts);
      }
    },
    [dispatch]
  );

  const handleChangeTab = (e, index) => setActiveTab(index)
  
  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Smart Contracts"} />
      <div className="page-body container-fluid">
        <div className="w-100 h-auto">
          <div className="row ">
            <div className="col-md-12 mb-3 h-100 w-100 h-auto p-3">
              <div className="w-100 card card-light justify-content-start h-100 p-3">
                {isLoadingPanels ? (
                  <ContentLoader />
                ) : (
                  <PanelOverview overview={overviewInfo} />
                )}
              </div>
            </div>
            <div className="col-md-12 mb-3 h-100 w-100 h-auto p-3">
              <div className="w-100 card card-light justify-content-start h-100 p-3 form-tabulator active">
                <div className="form-group-app">
                  {isLoadingPanels ? (
                    <ContentLoader />
                  ) : (
                    <TabulationBody active={activeTab} onChange={handleChangeTab}>
                      <TabContaier sectionName={"Code"}>
                        <PanelSource
                          title="Read Contract Information"
                          address={id}
                          contracts={contractsList}
                        />
                      </TabContaier>
                      <TabContaier
                        id="form-tab-read-smart-contracts-explorer"
                        sectionName="Read contract"
                      >
                        <PanelMethod
                          title="Read Information"
                          items={specificationsList.readList || []}
                          type={"view"}
                          address={id}
                          active={activeTab}
                        />
                      </TabContaier>
                      <TabContaier
                        id="form-tab-write-smart-contracts-explorer"
                        sectionName={"Write contract"}
                      >
                        <PanelMethod
                          title="Write Information"
                          items={specificationsList.writeList || []}
                          type={"write"}
                          address={id}
                          active={activeTab}
                        />
                      </TabContaier>
                    </TabulationBody>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorerEscrow;
