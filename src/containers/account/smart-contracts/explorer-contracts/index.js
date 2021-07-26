/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSmcSpecification } from "../../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import SiteHeader from "../../../components/site-header";
import TabulationBody from "../../../components/tabulator/tabuator-body";
import TabContaier from "../../../components/tabulator/tab-container";
import PanelOverview from "./panel-overview";
import TabMethodPanel from "./tab-panel-method";

const ExplorerContracts = (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;

  const handleSendMessage = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", null));
  };

  const [specificationsList, setSpecificationsList] = useState({});
  const [overviewInfo, setOverviewInfo] = useState([]);

  useEffect(() => {
    getContractSpecification(id);
  }, [id]);

  const getContractSpecification = useCallback(
    async (id) => {
      const specifications = await dispatch(getSmcSpecification(id));
      if (specifications) {
        const { members, overview } = specifications;

        const mambersList = members.reduce(
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

        setSpecificationsList(mambersList);
        setOverviewInfo(overview);
      }
    },
    [dispatch]
  );
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
                <PanelOverview overview={overviewInfo} />
              </div>
            </div>
            <div className="col-md-12 mb-3 h-100 w-100 h-auto p-3">
              <div className="w-100 card card-light justify-content-start h-100 p-3 form-tabulator active">
                <div className="form-group-app">
                  <TabulationBody>
                    <TabContaier sectionName={"Read smart contract"}>
                      <TabMethodPanel
                        title={"Read Information"}
                        items={specificationsList.readList || []}
                        type={"view"}
                        address={id}
                      />
                    </TabContaier>
                    <TabContaier sectionName={"Write contract"}>
                      <TabMethodPanel
                        title={"Write Contract Information"}
                        items={specificationsList.writeList || []}
                        type={"write"}
                        address={id}
                      />
                    </TabContaier>
                  </TabulationBody>
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
