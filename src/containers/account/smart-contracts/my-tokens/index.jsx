/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/
/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getContracts } from "../../../../actions/contracts";
import { getSmcSpecification } from "../../../../actions/contracts";
import SiteHeader from "../../../components/site-header";
import CustomTable from "../../../components/tables/table";
import { ContractTableItemTokens } from "../contract-table-item-tokens";
import { processAccountRStoHex } from "apl-web-crypto";
import { exportReadMethod } from "../../../../actions/contracts";

const MyTokens = () => {
  const dispatch = useDispatch();
  const [contractList, setContractList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  useEffect(() => {
    getContractsList();
  }, [pagination]);

  const getContractsList = useCallback(async () => {
    const { contracts, errorCode } = await dispatch(
      getContracts({
        firstIndex: pagination.firstIndex,
        lastIndex: pagination.lastIndex,
      })
    );
    if (errorCode) {
      setContractList([]);
      return;
    }
    const contractList = await Promise.all(
      contracts.map((el) => dispatch(getSmcSpecification(el.address)))
    );
    const balanceList = await Promise.all(
      contracts.map((el) =>
        dispatch(
          exportReadMethod({
            address: el.address,
            members: [
              {
                function: "balanceOf",
                input: [processAccountRStoHex(el.address, true)],
              },
            ],
          })
        )
      )
    );

    const currentOverviewList = contractList.map((el) =>
      el.overview.find((item) => item.name === "symbol")
    );

    const currentContractsList = contracts.map((item, index) => {
      return {
        ...item,
        symbol: currentOverviewList[index].value,
        balance: balanceList[index].results[0].output[0],
      };
    });

    setContractList(currentContractsList);
  }, [dispatch, pagination]);

  const onPaginate = (currentPage) => {
    setPagination({
      page: currentPage,
      firstIndex: currentPage * 15 - 15,
      lastIndex: currentPage * 15,
    });
  };

  const prevPaginate = () => onPaginate(pagination.page - 1);
  const nextPaginate = () => onPaginate(pagination.page + 1);
  
  return (
    <div className="page-content">
      <SiteHeader pageTitle="My tokens" />
      <div className="page-body container-fluid">
        <div className="card full-height">
          <div class="card-body">
            <CustomTable
              id={"smart-contracts-tokens"}
              header={[
                {
                  name: "Address",
                  alignRight: false,
                },
                {
                  name: "Token symbol",
                  alignRight: false,
                },
                {
                  name: "Balance",
                  alignRight: false,
                },
                {
                  name: "Short Hash",
                  alignRight: false,
                },
                {
                  name: "Action",
                  alignRight: true,
                },
              ]}
              className={"no-min-height"}
              emptyMessage={"No Smart Contracts found."}
              page={pagination.page}
              TableRowComponent={ContractTableItemTokens}
              tableData={contractList}
              isPaginate
              previousHendler={prevPaginate}
              nextHendler={nextPaginate}
              itemsPerPage={15}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTokens;
