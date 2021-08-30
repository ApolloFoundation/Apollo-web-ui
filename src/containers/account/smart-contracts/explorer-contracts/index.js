/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import {
  getSmcSpecification,
  getSmcSourceInfo,
} from "../../../../actions/contracts";
import SiteHeader from "../../../components/site-header";
import ContentLoader from "../../../components/content-loader";
import TabulationBody from "../../../components/tabulator/tabuator-body";
import TabContaier from "../../../components/tabulator/tab-container";
import PanelMethod from "./panels/panel-method";
import PanelOverview from "./panels/panel-overview";
import PanelSource from "./panels/panel-source";

const ExplorerContracts = (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;

  const [specificationsList, setSpecificationsList] = useState({});
  const [contractsList, setContractsList] = useState([]);
  const [overviewInfo, setOverviewInfo] = useState([]);
  const [sourceInfo, setSourceInfo] = useState({});
  const [isLoadingPanels, setIsLoadingPanels] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  useEffect(() => {
    getContractSpecification(id);
    getSourceSpecification(id);
  }, [id]);

  const getContractSpecification = useCallback(
    async (id) => {
      setIsLoadingPanels((state) => !state);
      const specifications = await dispatch(getSmcSpecification(id));
      if (specifications) {
        const { members, overview, inheritedContracts } = specifications;

        const membersList = members.reduce(
          (acc, item) => {
            if (item.stateMutability === "view") {
              acc.readList.push(item);
            } else {
              acc.writeList.push(item);
            }
            return acc;
          },
          { readList: [], writeList: [] }
        );
        setSpecificationsList(membersList);
        setOverviewInfo(overview);
        setContractsList(inheritedContracts);
        setIsLoadingPanels((state) => !state);
      }
    },
    [dispatch]
  );

  const getSourceSpecification = useCallback(
    async (id) => {
      setIsLoadingInfo((state) => !state);
      const source = await dispatch(getSmcSourceInfo(id));
      if (source) {
        setSourceInfo(source.contracts[0]);
        setIsLoadingInfo((state) => !state);
      }
    },
    [dispatch, setSourceInfo]
  );

  const handleSendMessage = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", null));
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Smart Contracts"}>
        <Link
          to={"/smart-contracts/create"}
          className="btn btn-green btn-sm ml-3"
        >
          Create New Contract
        </Link>
        <button
          type={"button"}
          className="btn btn-green btn-sm ml-3"
          onClick={handleSendMessage}
        >
          Send message
        </button>
      </SiteHeader>
      <div className="page-body container-fluid">
        <div className="w-100 h-auto">
          <div className="row ">
            <div className="col-md-12 mb-3 h-100 w-100 h-auto p-3">
              <div className="w-100 card card-light justify-content-start h-100 p-3">
                {isLoadingInfo ? (
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
                    <TabulationBody active={1}>
                      <TabContaier sectionName={"Code"}>
                        <PanelSource
                          title={"Read Contract Information"}
                          source={sourceInfo}
                          contracts={contractsList}
                        />
                      </TabContaier>
                      <TabContaier sectionName={"Read contract"}>
                        <PanelMethod
                          title={"Read Information"}
                          items={specificationsList.readList || []}
                          type={"view"}
                          address={id}
                        />
                      </TabContaier>
                      <TabContaier sectionName={"Write contract"}>
                        <PanelMethod
                          title={"Write Information"}
                          items={specificationsList.writeList || []}
                          type={"write"}
                          address={id}
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

export default ExplorerContracts;
