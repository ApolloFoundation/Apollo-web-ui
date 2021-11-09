/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getSmcSpecification,
  getSmcEvent,
} from "../../../../actions/contracts";
import SiteHeader from "../../../components/site-header";
import CustomTable from "../../../components/tables/table";
import ContentLoader from "../../../components/content-loader";
import Overview from "./overwiev";
import TableItemToken from "../table-items/token";
import { processAccountRStoHex } from "apl-web-crypto";

const ExplorerToken = (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;

  const [tokenList, setTokenList] = useState([]);
  const [overviewInfo, setOverviewInfo] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [isLoadingPanels, setIsLoadingPanels] = useState(true);

  useEffect(() => {
    getContractSpecification(id);
    getSmcEventTransfer(id);
    getSmcEventBay(id);
  }, [id]);

  const getSmcEventTransfer = useCallback(
    async (id) => {
      const transfer = await dispatch(
        getSmcEvent(id, {
          event: "Transfer",
          fromBlock: 0,
          filter: `{ "to" : {"$eq": "${processAccountRStoHex(id, true)}"} }`,
        })
      );
      if (transfer) {
        let transferCurrentList = [];
        transfer.events.map((item) => {
          let itemState = JSON.parse(item.state);
          transferCurrentList.push({
            name: item.name,
            signature: item.signature,
            ...itemState,
          });
        });
        setTokenList(transferCurrentList);
      }
    },
    [dispatch]
  );

  const getSmcEventBay = useCallback(
    async (id) => {
      const eventBuy = await dispatch(
        getSmcEvent(id, {
          event: "Buy",
          fromBlock: 0,
          filter: `{ "who" : {"$eq": "${processAccountRStoHex(id, true)}"} }`,
        })
      );
      if (eventBuy) {
        let buyCurrentList = [];
        eventBuy.events.map((item) => {
          let itemState = JSON.parse(item.state);
          buyCurrentList.push({
            name: item.name,
            signature: item.signature,
            ...itemState,
          });
        });
        setTokenList((state) => state, ...buyCurrentList);
      }
    },
    [dispatch]
  );

  const getContractSpecification = useCallback(
    async (id) => {
      const specifications = await dispatch(getSmcSpecification(id));
      if (specifications) {
        const { overview } = specifications;
        const token = overview.find((item) => item.name === "symbol");
        setIsLoadingPanels(false);
        setCurrentToken(token);
        setOverviewInfo(overview);
      }
    },
    [dispatch]
  );

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Token"} />
      <div className="page-body container-fluid">
        <div className="w-100 h-auto">
          <div className="row ">
            <div className="col-md-12 mb-3 h-100 w-100 h-auto p-3">
              <div className="w-100 card card-light justify-content-start h-100 p-3">
                {isLoadingPanels ? (
                  <ContentLoader />
                ) : (
                  <Overview overview={overviewInfo} token={currentToken} />
                )}
              </div>
            </div>
            <div className="col-md-12 mb-3 h-100 w-100 h-auto p-3">
              <div className="w-100 card card-light justify-content-start h-100 p-3 form-tabulator active">
                <CustomTable
                  id={"smart-contracts-tokens"}
                  header={[
                    {
                      name: "Name",
                      alignRight: false,
                    },
                    {
                      name: "Transaction",
                      alignRight: false,
                    },
                    {
                      name: "From",
                      alignRight: false,
                    },
                    {
                      name: "Value",
                      alignRight: true,
                    },
                  ]}
                  className={"no-min-height"}
                  emptyMessage={"No Smart Contracts found."}
                  TableRowComponent={TableItemToken}
                  tableData={tokenList}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorerToken;
