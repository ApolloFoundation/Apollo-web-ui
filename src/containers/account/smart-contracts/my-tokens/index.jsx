/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { getContracts } from "../../../../actions/contracts";
import { getSmcSpecification } from "../../../../actions/contracts";
import SiteHeader from "../../../components/site-header";
import CustomTable from "../../../components/tables/table";
import TableItemTokens from "../table-items/tokens";
import { processAccountRStoHex } from "apl-web-crypto";
import { exportReadMethod } from "../../../../actions/contracts";
import SearchField from "../../../components/form-components/search-field";

const MyTokens = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState({});
  const [contractList, setContractList] = useState([]);
  const [filteredContractList, setFilteredContractList] = useState(null);
  const [viewContractList, setViewContractList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  useEffect(() => {
    getContractsList();
  }, [pagination, searchQuery]);

  const getContractsList = useCallback(async () => {
    const isSearch = Object.keys(searchQuery).length;
    const { contracts, errorCode } = await dispatch(getContracts(searchQuery));
    if (errorCode) {
      console.log(errorCode);
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

    if (isSearch) {
      setFilteredContractList(currentContractsList);
    } else {
      setContractList(currentContractsList);
    }
    setViewContractList(currentContractsList);
  }, [dispatch, pagination, searchQuery]);

  const onPaginate = (currentPage) => {
    setPagination({
      page: currentPage,
      firstIndex: currentPage * 15 - 15,
      lastIndex: currentPage * 15,
    });
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

    if (data.symbol) {
      const dataLength = Object.keys(data).length > 1;
      if (dataLength) {
        setSearchQuery(data);
      }
      const filteredList = (
        dataLength ? filteredContractList : contractList
      ).filter((contract) => {
        return contract.symbol
          .toLowerCase()
          .includes(data.symbol.toLowerCase());
      });
      setViewContractList(filteredList);
      return;
    }

    if (data.hasOwnProperty("balance")) {
      const dataLength = Object.keys(data).length > 1;
      if (dataLength) {
        setSearchQuery(data);
      }
      const filteredList = (
        dataLength ? filteredContractList : contractList
      ).filter((contract) => {
        return contract.balance
          .toLowerCase()
          .includes(data.balance.toLowerCase());
      });
      setViewContractList(filteredList);
      return;
    }
    if (!isSearch) {
      setFilteredContractList(null);
      setViewContractList([...contractList]);
      return;
    }

    setSearchQuery(data);
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle="My tokens" />
      <div className="page-body container-fluid">
        <div className="transactions-filters p-0">
          <div className="search-bar">
            <Formik onSubmit={handleSearch} initialValues={{}}>
              {({ values, setValue }) => {
                return (
                  <Form className="form-group-app input-group-app transparent mb-0 row">
                    <div className="col-md-6 col-lg p-0 pr-lg-3">
                      <SearchField
                        name={"address"}
                        field="address"
                        placeholder="address"
                        setValue={setValue}
                      />
                    </div>
                    <div className="col-md-6 col-lg p-0 pr-lg-3">
                      <SearchField
                        name={"symbol"}
                        field="symbol"
                        placeholder="symbol"
                        setValue={setValue}
                      />
                    </div>
                    <div className="col-md-6 col-lg p-0 pr-lg-0">
                      <SearchField
                        name={"balance"}
                        field="balance"
                        placeholder="balance"
                        setValue={setValue}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
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
                  alignRight: true,
                },
                {
                  name: "Short Hash",
                  alignRight: true,
                },
                {
                  name: "Action",
                  alignRight: true,
                },
              ]}
              className={"no-min-height"}
              emptyMessage={"No Smart Contracts found."}
              page={pagination.page}
              TableRowComponent={TableItemTokens}
              tableData={viewContractList}
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
