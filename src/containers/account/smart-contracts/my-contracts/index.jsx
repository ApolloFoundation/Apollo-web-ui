/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyContracts } from "../../../../actions/contracts";
import SiteHeader from "../../../components/site-header";
import TableItemMyContract from "../table-items/my-contract";
import CustomTable from "../../../components/tables/table";

const SmartContracts = () => {
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.account);
  const [contractList, setContractList] = useState(null);

  useEffect(() => {
    getMyContractsList();
  }, []);

  const getMyContractsList = useCallback(async () => {
    const { contracts, errorCode } = await dispatch(getMyContracts(account));

    if (errorCode) {
      console.log(errorCode);
      return;
    }

    setContractList(contracts);
  }, [dispatch, account]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"My contracts"} />
      <div className="page-body container-fluid">
        <CustomTable
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
          TableRowComponent={TableItemMyContract}
          tableData={contractList}
        />
      </div>
    </div>
  );
};

export default SmartContracts;
