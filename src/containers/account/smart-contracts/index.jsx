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
import { formatTimestamp } from "../../../helpers/util/time";
import SiteHeader from "../../components/site-header";
import CustomTable from "../../components/tables/table";
import TableItemContract from "./table-items/contract";
import TableItemEscrow from "./table-items/escrow";
import Button from "../../components/button";
import SearchField from "../../components/form-components/search-field";

const TABLE_HEAD_CONTRACT = [
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
];

const TABLE_HEAD_ESCROW = [
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
];

const SmartContracts = () => {
  const dispatch = useDispatch();
  const [contractList, setContractList] = useState([]);
  const [filteredContractList, setFilteredContractList] = useState([]);
  const [viewContractList, setViewContractList] = useState([]);
  const [viewEscrow, setViewEscrow] = useState(false);
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

        setContractList(currentContractsList);
        setViewContractList(currentContractsList);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleCreateToken = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN"));
  }, [dispatch]);

  const handleCreateEscrow = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_ESCROW"));
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
          onClick={handleCreateToken}
        />
        <Button
          id={"button-smart-contracts-cteate-token"}
          name="Create escrow"
          className="mr-2"
          color="green"
          size="sm"
          onClick={handleCreateEscrow}
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
                    {!viewEscrow && (
                      <div className=" col-md p-0 pr-md-3">
                        <SearchField
                          name={"symbol"}
                          field="symbol"
                          placeholder="symbol"
                          setValue={setValue}
                        />
                      </div>
                    )}
                    <div className=" col-md p-0">
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
              header={viewEscrow ? TABLE_HEAD_ESCROW : TABLE_HEAD_CONTRACT}
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
