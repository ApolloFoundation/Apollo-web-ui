/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { processAccountRStoHex } from "apl-web-crypto";
import { getContracts } from "../../../../actions/contracts";
import { getSmcSpecification } from "../../../../actions/contracts";
import { exportReadMethod } from "../../../../actions/contracts";
import { formatTimestamp } from "../../../../helpers/util/time";
import SiteHeader from "../../../components/site-header";
import CustomTable from "../../../components/tables/table";
import TableItemTokens from "../table-items/tokens";
import SearchField from "../../../components/form-components/search-field";

const MyTokens = () => {
  const dispatch = useDispatch();
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
  }, []);

  const getContractsList = useCallback(async () => {
    const { contracts, errorCode } = await dispatch(getContracts());

    if (errorCode) {
      return;
    }

    const filteredList = contracts.filter((el) => {
      return el.baseContract.startsWith("APL20");
    });

    const symbolsList = await Promise.all(
      filteredList.map((el) => {
        return dispatch(getSmcSpecification(el.address));
      })
    );

    const currentOverviewList = symbolsList.map((el) =>
      el.members.find((item) => item.name === "symbol")
    );

    const balanceList = await Promise.all(
      filteredList.map((el) =>
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

    const currentContractsList = filteredList
      .map((item, index) => ({
        ...item,
        symbol: currentOverviewList[index].value,
        balance: balanceList[index].results[0].output[0],
      }))
      .filter((item) => item.balance > 0);

    setContractList(currentContractsList);
    setViewContractList(currentContractsList);
  }, [dispatch]);

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
      <SiteHeader pageTitle="My tokens" />
      <div className="page-body container-fluid">
        <div className="transactions-filters p-0">
          <div className="search-bar">
            <Formik onSubmit={handleSearch} initialValues={{}}>
              {({ values, setValue }) => {
                return (
                  <Form className="form-group-app input-group-app transparent mb-0 row">
                    <div className="col-md p-0 pr-md-3">
                      <SearchField
                        name={"address"}
                        field="address"
                        placeholder="address"
                        setValue={setValue}
                      />
                    </div>
                    <div className="col-md p-0 pr-md-3">
                      <SearchField
                        name={"symbol"}
                        field="symbol"
                        placeholder="symbol"
                        setValue={setValue}
                      />
                    </div>
                    <div className="col-md p-0">
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
