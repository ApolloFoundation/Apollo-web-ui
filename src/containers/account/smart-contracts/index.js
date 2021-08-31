/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { ContractTableItem } from "./contract-table-item";
import { getContracts } from "../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../modules/modals";
import SiteHeader from "../../components/site-header";
import CustomTable from "../../components/tables/table";
import CustomFormSelect from "../../components/form-components/custom-form-select";
import SearchField from "../../components/form-components/search-field";

const STATUS_DATA = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "CLOSED", label: "CLOSED" },
  { value: "DESTROYED", label: "DESTROYED" },
];

export default function SmartContracts() {
  const dispatch = useDispatch();

  const [contractList, setContractList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
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
        ...searchQuery,
      })
    );
    if (myContracts.errorCode) {
      setContractList([]);
    } else {
      setContractList(myContracts.contracts);
    }
  }, [dispatch, pagination, searchQuery]);

  useEffect(() => {
    getContractsList();
  }, [pagination, searchQuery]);

  const onPaginate = (currentPage) => {
    setPagination({
      page: currentPage,
      firstIndex: currentPage * 15 - 15,
      lastIndex: currentPage * 15,
    });
  };

  const prevPaginate = () => onPaginate(pagination.page - 1);
  const nextPaginate = () => onPaginate(pagination.page + 1);

  const handleSendMessage = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", null));
  };

  const handleSearch = (values) => {
    setSearchQuery((state) => ({ ...state, ...values }));
  };

  const handleChangeStatus = (value) => {
    setSearchQuery((state) => ({ ...state, status: value }));
  };

  const handleCrateToken = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN", null));
  }, [dispatch]);
  
  return (
    <div className="page-content">
      <SiteHeader pageTitle={"Smart Contracts"}>
        <button
          type={"button"}
          className="btn btn-green btn-sm ml-3"
          onClick={handleCrateToken}
        >
          Create token
        </button>
      </SiteHeader>
      <div className="page-body container-fluid">
        <div className="row">
          <div className="col-md-12 p-0 mb-15">
            <div className="transactions-filters p-0">
              <div className="search-bar">
                <Formik onSubmit={handleSearch} initialValues={{}}>
                  {({ values, setValue }) => {
                    return (
                      <Form className="form-group-app input-group-app transparent mb-0 row">
                        <div className="col-md-6 col-lg p-0 pr-md-3">
                          <SearchField
                            name={"address"}
                            field="address"
                            placeholder="address"
                            setValue={setValue}
                          />
                        </div>
                        <div className="col-md-6 col-lg p-0 pr-lg-3">
                          <SearchField
                            name={"publisher"}
                            field="publisher"
                            placeholder="Publisher"
                            setValue={setValue}
                          />
                        </div>
                        <div className="col-md-6 col-lg p-0 pr-md-3">
                          <SearchField
                            name={"name"}
                            field="name"
                            placeholder="Name"
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
          </div>
          <CustomTable
            header={[
              {
                name: "Adress",
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
    </div>
  );
}
