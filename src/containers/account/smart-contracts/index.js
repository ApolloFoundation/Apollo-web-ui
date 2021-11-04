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
import { ContractTableItem } from "./contract-table-item";
import { ContractTableItemEscrow } from "./contract-table-item-escrow";
import Button from "../../components/button";

import CustomFormSelect from "../../components/form-components/custom-form-select";
import SearchField from "../../components/form-components/search-field";

const STATUS_DATA = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "CLOSED", label: "CLOSED" },
  { value: "DESTROYED", label: "DESTROYED" },
];

export default function SmartContracts() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(null);
  const [contractList, setContractList] = useState([]);
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
    const myContracts = await dispatch(
      getContracts({
        firstIndex: pagination.firstIndex,
        lastIndex: pagination.lastIndex,
        ...searchQuery,
      })
    );
    if (myContracts.errorCode) {
      setContractList([]);
    } else {
      Promise.all(
        myContracts.contracts.map(async (el) => {
          return await dispatch(getSmcSpecification(el.address));
        })
      )
        .then((data) => {
          const currentOverviewList = data.map((el) =>
            el.overview.find((item) => item.name === "symbol")
          );
          const currentContractsList = myContracts.contracts.map(
            (item, index) => {
              return { ...item, symbol: currentOverviewList[index].value };
            }
          );
          setContractList(currentContractsList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    for (const key in values) {
      if (values[key].length == 0) {
        delete values[key];
      }
    }
    setSearchQuery({ ...values });
  };

  const handleChangeStatus = (value) => {
    handleSearch({ ...searchQuery, status: value });
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
                    <div className="col-md-6 col-lg p-0">
                      <CustomFormSelect
                        placeholder={"Status"}
                        options={STATUS_DATA}
                        field={"status"}
                        setValue={setValue}
                        onChange={handleChangeStatus}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
        <div className="card full-height">
          <div class="card-title">{!viewEscrow ? "Tokens" : "Escrow"}</div>
          <div class="card-body">
            {!viewEscrow ? (
              <CustomTable
                id={"smart-contracts-tokens"}
                header={[
                  {
                    name: "Address",
                    alignRight: false,
                  },
                  {
                    name: "Symbol",
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
                className={"no-min-height"}
                emptyMessage={"No Smart Contracts found."}
                page={pagination.page}
                TableRowComponent={ContractTableItem}
                tableData={contractList}
                isPaginate
                previousHendler={prevPaginate}
                nextHendler={nextPaginate}
                itemsPerPage={15}
              />
            ) : (
              <CustomTable
                id={"smart-contracts-escrow"}
                header={[
                  {
                    name: "Address",
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
                className={"no-min-height"}
                emptyMessage={"No Smart Contracts found."}
                page={pagination.page}
                TableRowComponent={ContractTableItemEscrow}
                tableData={contractList}
                isPaginate
                previousHendler={prevPaginate}
                nextHendler={nextPaginate}
                itemsPerPage={15}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
