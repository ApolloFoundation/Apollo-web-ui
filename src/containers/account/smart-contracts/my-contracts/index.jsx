/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SiteHeader from "../../../components/site-header";
import TableItemMyContract from "../table-items/my-contract";
import { getMyContracts } from "../../../../actions/contracts";
import CustomTable from "../../../components/tables/table";

const SmartContracts = () => {
  const dispatch = useDispatch();

  const { account } = useSelector((state) => state.account);

  const [contractList, setContractList] = useState(null);
  const [perPage, setPerPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getMyContractsList = useCallback(async () => {
    const myContracts = await dispatch(getMyContracts(account));
    if (myContracts) {
      setContractList(myContracts.contracts);
    }
  }, [dispatch, account]);

  const formatData = () => {
    const indexOfLastPost = pagination.page * perPage;
    const indexOfFirstPage = indexOfLastPost - perPage;

    const currentPosts = contractList.slice(indexOfFirstPage, indexOfLastPost);
    setContractList(currentPosts);
  };

  useEffect(() => {
    getMyContractsList();
  }, []);

  const onPaginate = (currentPage) => {
    setPagination((prevState) => ({
      ...prevState,
      page: currentPage,
    }));
    formatData();
  };

  const prevPaginate = () => onPaginate(pagination.page - 1);
  const nextPaginate = () => onPaginate(pagination.page + 1);

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
          page={pagination.page}
          TableRowComponent={TableItemMyContract}
          tableData={contractList}
          isPaginate
          previousHendler={prevPaginate}
          nextHendler={nextPaginate}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
};

export default SmartContracts;
