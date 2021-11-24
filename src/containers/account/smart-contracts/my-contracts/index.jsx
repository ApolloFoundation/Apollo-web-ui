/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { getMyContracts } from "../../../../actions/contracts";
import { formatTimestamp } from "../../../../helpers/util/time";
import SiteHeader from "../../../components/site-header";
import TableItemMyContract from "../table-items/my-contract";
import CustomTable from "../../../components/tables/table";
import SearchField from "../../../components/form-components/search-field";
import ContentLoader from "../../../components/content-loader";

const SmartContracts = () => {
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.account);

  const [contractList, setContractList] = useState([]);
  const [filteredContractList, setFilteredContractList] = useState([]);
  const [viewContractList, setViewContractList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  useEffect(() => {
    getMyContractsList();
  }, []);

  const getMyContractsList = useCallback(async () => {
    const contractsDataList = await dispatch(getMyContracts(account));

    if (!contractsDataList) {
      setIsLoading(false);
      return;
    }

    const { contracts } = contractsDataList;

    setIsLoading(false);
    setContractList(contracts);
    setViewContractList(contracts);
  }, [dispatch, account]);

  const onPaginate = (currentPage) => {
    setPagination({
      page: currentPage,
      firstIndex: currentPage * 15 - 15,
      lastIndex: currentPage * 15,
    });

    if (filteredContractList.length > 0) {
      setViewContractList([
        ...filteredContractList.slice(currentPage * 15 - 15),
      ]);
      return;
    }

    setViewContractList([...contractList.slice(currentPage * 15 - 15)]);
  };

  const prevPaginate = () => onPaginate(pagination.page - 1);
  const nextPaginate = () => onPaginate(pagination.page + 1);

  const handleSearch = (values) => {
    let isSearch = false;
    const data = Object.entries(values).reduce((acc, [key, value]) => {
      if (value.length > 0) {
        acc[key] = value;
        isSearch = true;
      }
      return acc;
    }, {});

    if (!isSearch) {
      setFilteredContractList([]);
      setViewContractList([...contractList]);
      setPagination({
        page: 1,
        firstIndex: 0,
        lastIndex: 15,
      });
      return;
    }

    const filtersList = Object.entries(data);

    const list = contractList.filter((item) =>
      filtersList.every(([key, value]) => {
        if (key === "publish") {
          return (
            dispatch(formatTimestamp(new Date(item.timestamp))) === value.trim()
          );
        }

        return item[key].toLowerCase().includes(value.toLowerCase());
      })
    );

    setFilteredContractList(list);
    setViewContractList(list);
    setPagination({
      page: 1,
      firstIndex: 0,
      lastIndex: 15,
    });
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"My contracts"} />
      <div className="page-body container-fluid">
        <div className="transactions-filters">
          <div className="search-bar">
            <Formik onSubmit={handleSearch} initialValues={{}}>
              {({ values, setValue }) => {
                return (
                  <Form className="form-group-app input-group-app transparent mb-0 row">
                    <div className=" col-md p-0 pr-md-3">
                      <SearchField
                        name={"address"}
                        field="address"
                        placeholder="address"
                        setValue={setValue}
                      />
                    </div>
                    <div className="col-md p-0">
                      <SearchField
                        name={"publish"}
                        field="publish"
                        placeholder="publish"
                        setValue={setValue}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
        {isLoading ? (
          <ContentLoader />
        ) : (
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
            tableData={viewContractList}
            page={pagination.page}
            isPaginate
            previousHendler={prevPaginate}
            nextHendler={nextPaginate}
            itemsPerPage={15}
          />
        )}
      </div>
    </div>
  );
};

export default SmartContracts;
