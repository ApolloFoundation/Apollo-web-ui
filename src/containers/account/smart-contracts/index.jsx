/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from "formik";
import classNames from "classnames";
import moment from "moment";
import { getContracts } from "../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../modules/modals";
import { getSmcSpecification } from "../../../actions/contracts";
import SiteHeader from "../../components/site-header";
import CustomTable from "../../components/tables/table";
import TableItemContract from "./table-items/contract";
import TableItemEscrow from "./table-items/escrow";
import Button from "../../components/button";
import ContentLoader from "../../components/content-loader";
import TextualInputComponent from "../../components/form-components/textual-input1";
import AccountRSForm from "../../components/form-components/account-rs1";
import InputDate from "../../components/input-date";

import { TABLE_DATA } from "./table-data";

const initialFilter = {
  address: undefined,
  publish: undefined,
  transaction: undefined,
  symbol: undefined,
};

const SmartContracts = ({ owner }) => {
  const dispatch = useDispatch();
  const { accountRS } = useSelector((state) => state.account);
  const [type, setType] = useState('token')
  const [publishedDate, setPublishedDate] = useState(null)
  const [filtersData, setFiltersData] = useState(initialFilter)
  const [contractList, setContractList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  useEffect(() => {
    onPaginate(1);
  }, [filtersData, type, owner]);

  const getContractsList = useCallback(async (currPagination) => {
    let newPagination = currPagination;
    if (!newPagination) {
      newPagination = { ...pagination };
    }

    const contractParams = {
      publisher: owner ? accountRS : undefined,
      address: !!filtersData.address?.length ? filtersData.address : undefined,
      timestamp: filtersData.publish && moment(filtersData.publish).valueOf() || undefined,
      transaction: !!filtersData.transaction?.length ? filtersData.transaction : undefined,
      firstIndex: newPagination.firstIndex,
      lastIndex: newPagination.lastIndex,
    }
    switch (type) {
      case 'escrow':
        contractParams.baseContract = 'TokenEscrow';
        break;
      case 'token':
        contractParams.baseContract = 'APL20';
        break;
      default:
        break;
    }
    const contractsDataList = await dispatch(getContracts(contractParams));
    if (!contractsDataList) {
      setIsLoading(false);
      return;
    }
    const { contracts } = contractsDataList;

    Promise.all(
      contracts.map(contract => dispatch(getSmcSpecification(contract.address)))
    ).then((contractSpec) => {
      const currentOverviewList = contractSpec.map((el) => {
        return el !== null ? el.members.find((item) => item.name === "symbol") : {};
      });

      const currentContractsList = contracts.map((contract, index) => {
        return {
          ...contract,
          symbol: currentOverviewList[index]?.value || "",
        };
      });

      setPagination({ ...newPagination });
      setContractList(currentContractsList);
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
    });
  }, [dispatch, pagination, filtersData, owner, accountRS, type]);

  const onPaginate = useCallback(async currentPage => {
    const newPagination = {
      page: currentPage,
      firstIndex: currentPage * 15 - 15,
      lastIndex: currentPage * 15,
    };
    await getContractsList(newPagination);
  }, [getContractsList]);

  const prevPaginate = () => onPaginate(pagination.page - 1);
  const nextPaginate = () => onPaginate(pagination.page + 1);

  const handleSearch = useCallback(async values => {
    setFiltersData(({...filtersData, ...values}));
  }, [filtersData]);

  const handleClearTransactionFilters = (resetForm) => () => {
    setFiltersData(initialFilter);
    resetForm();
    setPublishedDate(null);
  }

  const handleTransactionFilters = useCallback(async currType => {
    if (currType === type) return;
    setType(currType);
  }, [type]);

  const handleCreateToken = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN"));
  }, [dispatch]);

  const handleCreateEscrow = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_ESCROW"));
  }, [dispatch]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle={owner ? "My Contracts" : "Contracts"}>
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
      </SiteHeader>
      <div className="page-body container-fluid">
        <div className="transactions-filters">
          <div className="top-bar mb-4">
            {TABLE_DATA.type.map((item) => (
              <div
                className={classNames({
                  btn: true,
                  filter: true,
                  active: type === item.type,
                })}
                key={item.name}
                onClick={() => handleTransactionFilters(item.type)}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="search-bar">
            <Formik onSubmit={handleSearch} initialValues={filtersData}>
              {({ resetForm, setFieldValue }) => {
                return (
                  <Form className="form-group-app input-group-app transparent mb-0 row" autocomplete="off">
                    <div className="col-md p-0 pr-md-3">
                      <AccountRSForm
                        noContactList={true}
                        name='address'
                        placeholder='Address'
                      />
                    </div>
                    <div className="col-md p-0 pr-md-3">
                      <InputDate
                        name='publish'
                        placeholder='Published'
                        selected={ publishedDate }
                        onChange={ (date) => {
                          setPublishedDate(date);
                          setFieldValue('publish', moment(date).toISOString());
                        } }
                        showTimeSelect
                        timeIntervals={ 1 }
                        timeFormat="HH:mm:ss"
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm:ss aa"
                      />
                    </div>
                    <div className="col-md p-0">
                      <TextualInputComponent
                        name='transaction'
                        placeholder='Transaction'
                        type='text'
                      />
                    </div>
                    { type !== "escrow" && (
                      <div className="col-md p-0 pl-md-3">
                        <TextualInputComponent
                          name='symbol'
                          placeholder='Symbol'
                          type='text'
                        />
                      </div>
                    ) }
                    <div className="col-md p-0 pl-md-3">
                      <div className="row">
                        <div className="col-md p-0 pl-md-3">
                          <Button
                            className="m-0"
                            name="Submit"
                            color="green"
                            type="submit"
                            size="md"
                          />
                        </div>
                        <div className="col-md p-0 pl-md-3">
                          <Button
                            className="m-0"
                            name="Clear"
                            color="grey"
                            type="button"
                            size="md"
                            onClick={ handleClearTransactionFilters(resetForm) }
                          />
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
        <div className="card full-height">
          <div className="card-body">
            {isLoading ? (
              <ContentLoader />
            ) : (
              <CustomTable
                id={"smart-contracts-tokens"}
                header={
                  type === "escrow"
                    ? TABLE_DATA.head.escrow
                    : TABLE_DATA.head.token
                }
                className={"no-min-height"}
                emptyMessage={"No Smart Contracts found."}
                TableRowComponent={
                  type === "escrow" ? TableItemEscrow : TableItemContract
                }
                tableData={contractList}
                page={pagination.page}
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
};
export default SmartContracts;
