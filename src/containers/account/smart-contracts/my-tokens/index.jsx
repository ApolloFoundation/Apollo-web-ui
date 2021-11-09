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
  const [searchQuery, setSearchQuery] = useState(null);
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

  const handleSearch = (values) => {
    const data = Object.entries(values).reduce((acc, [key, value]) => {
      if (value.length > 0) {
        acc[key] = value;
      }
      return acc;
    }, {});
    setSearchQuery(data);
  };
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
