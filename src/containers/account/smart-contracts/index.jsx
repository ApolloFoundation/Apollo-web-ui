/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { getContracts } from "../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../modules/modals";
import { getSmcSpecification } from "../../../actions/contracts";
import SiteHeader from "../../components/site-header";
import CustomTable from "../../components/tables/table";
import TableItemContract from "./table-items/contract";
import TableItemEscrow from "./table-items/escrow";
import Button from "../../components/button";
import SearchField from "../../components/form-components/search-field";

const SmartContracts = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState({});
  const [contractList, setContractList] = useState([]);
  const [filteredContractList, setFilteredContractList] = useState(null);
  const [viewContractList, setViewContractList] = useState([]);
  const [viewEscrow, setViewEscrow] = useState(false);
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

    Promise.all(
      contracts.map(async (el) => {
        return await dispatch(getSmcSpecification(el.address));
      })
    )
      .then((data) => {
        const currentOverviewList = data.map((el) =>
          el.overview.find((item) => item.name === "symbol")
        );
        const currentContractsList = contracts.map((item, index) => {
          return { ...item, symbol: currentOverviewList[index].value };
        });
        if (isSearch) {
          setFilteredContractList(currentContractsList);
        } else {
          setContractList(currentContractsList);
        }
        setViewContractList(currentContractsList);
      })
      .catch((err) => {
        console.log(err);
      });
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

    if (!isSearch) {
      setFilteredContractList(null);
      setViewContractList([...contractList]);
      return;
    }

    setSearchQuery(data);
  };

  const handleCrateToken = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN", null));
  }, [dispatch]);

  const handleChangeViewEscrow = () => {
    setViewEscrow((state) => !state);
  };

  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Contracts"}>
        <Button
          id={"button-smart-contracts-cteate-token"}
          name="Create token"
          className="mr-2"
          color="green"
          size="sm"
          onClick={handleCrateToken}
        />
        <Button
          id={"button-smart-contracts-cteate-token"}
          name="Create escrow"
          className="mr-2"
          color="green"
          size="sm"
          onClick={handleCrateToken}
        />
        <Button
          id={"button-smart-contracts-cteate-token"}
          name="Tokens"
          className="mr-2"
          color={viewEscrow ? "default" : "green"}
          size="sm"
          onClick={handleChangeViewEscrow}
          disabled={!viewEscrow}
        />
        <Button
          id={"button-smart-contracts-cteate-token"}
          name="Escrow"
          color={viewEscrow ? "green" : "default"}
          size="sm"
          onClick={handleChangeViewEscrow}
          disabled={viewEscrow}
        />
      </SiteHeader>
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
                    {!viewEscrow && (
                      <div className="col-md-6 col-lg p-0 pr-lg-3">
                        <SearchField
                          name={"symbol"}
                          field="symbol"
                          placeholder="symbol"
                          setValue={setValue}
                        />
                      </div>
                    )}
                    <div className="col-md-6 col-lg p-0 pr-lg-3">
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
        <div className="card full-height">
          <div class="card-title">{viewEscrow ? "Escrow" : "Tokens"}</div>
          <div class="card-body">
            <CustomTable
              id={"smart-contracts-tokens"}
              header={
                viewEscrow
                  ? [
                      {
                        name: "Address",
                        alignRight: false,
                      },
                      {
                        name: "Transaction",
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
                    ]
                  : [
                      {
                        name: "Address",
                        alignRight: false,
                      },
                      {
                        name: "Symbol",
                        alignRight: false,
                      },
                      {
                        name: "Transaction",
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
                    ]
              }
              className={"no-min-height"}
              emptyMessage={"No Smart Contracts found."}
              TableRowComponent={
                viewEscrow ? TableItemEscrow : TableItemContract
              }
              tableData={viewContractList}
              page={pagination.page}
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
export default SmartContracts;
