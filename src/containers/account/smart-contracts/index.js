/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ContractTableItem } from "./contract-table-item";
import { getContracts } from "../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../modules/modals";
import SiteHeader from "../../components/site-header";
import CustomTable from "../../components/tables/table";

export default function SmartContracts() {
  const dispatch = useDispatch();
  const [contractList, setContractList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });
  const getContractsList = useCallback(async () => {
    const myContracts = await dispatch(
      getContracts({
        firstIndex: pagination.firstIndex,
        lastIndex: pagination.lastIndex,
      })
    );
    if (myContracts.errorCode) {
      setContractList([]);
    } else {
      setContractList(myContracts.contracts);
    }
  }, [dispatch, pagination]);

  useEffect(() => {
    getContractsList();
  }, [pagination]);

  const onPaginate = (currentPage) => {
    setPagination({
      page: currentPage,
      firstIndex: currentPage * 15 - 15,
      lastIndex: currentPage * 15,
    });
  };

  const prevPaginate = () => onPaginate(pagination.page - 1);
  const nextPaginate = () => onPaginate(pagination.page + 1);

  const handleCrateToken = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN", null));
  }, [dispatch]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Smart Contracts"}>
        <button
          id={"button-smart-contracts-cteate-token"}
          type={"button"}
          className="btn btn-green btn-sm ml-3"
          onClick={handleCrateToken}
        >
          Create token
        </button>
      </SiteHeader>
      <div className="page-body container-fluid">
        <CustomTable
          id={"smart-contracts"}
          header={[
            {
              name: "Address",
              alignRight: false,
            },
            {
              name: "Contract",
              alignRight: false,
            },
            {
              name: "Transaction id",
              alignRight: false,
            },
            {
              name: "Short Hash",
              alignRight: false,
            },
            {
              name: "Published",
              alignRight: false,
            },
            {
              name: "Status",
              alignRight: false,
            },
            {
              name: "Action",
              alignRight: true,
            },
          ]}
          className={"no-min-height mb-3"}
          emptyMessage={"No Smart Contracts found."}
          page={pagination.page}
          TableRowComponent={ContractTableItem}
          tableData={contractList}
          isPaginate
          previousHendler={prevPaginate}
          nextHendler={nextPaginate}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
