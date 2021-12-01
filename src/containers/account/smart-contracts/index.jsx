/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import classNames from "classnames";
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
import ContentLoader from "../../components/content-loader";

import { TABLE_DATA } from "./table-data";
import TextualInputComponent from '../../components/form-components/textual-input1';
import AccountRSForm from '../../components/form-components/account-rs1';
import moment from 'moment';
import InputDate from '../../components/input-date';

const initialFilter = {
  type: 'token',
  address: undefined,
  publish: undefined,
  transaction: undefined,
  symbol: undefined,

};

const SmartContracts = () => {
  const dispatch = useDispatch();
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
    getContractsList();
  }, []);

  useEffect(() => {
    onPaginate(1);
  }, [filtersData]);

  const getContractsList = useCallback(async (currPagination) => {
    let newPagination = currPagination;
    if (!newPagination) {
      newPagination = { ...pagination };
    }

    const contractParams = {
      address: filtersData.address,
      timestamp: filtersData.publish && moment(filtersData.publish).unix(),
      transaction: filtersData.transaction,
      firstIndex: newPagination.firstIndex,
      lastIndex: newPagination.lastIndex,
    }
    switch (filtersData.type) {
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
  }, [dispatch, pagination, filtersData]);

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
    if (currType === filtersData.type) return;
    setFiltersData({...filtersData, type: currType});
  }, [filtersData.type]);

  const handleCreateToken = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_TOKEN"));
  }, [dispatch]);

  const handleCreateEscrow = useCallback(() => {
    dispatch(setBodyModalParamsAction("SMC_CREATE_ESCROW"));
  }, [dispatch]);

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
      </SiteHeader>
      <div className="page-body container-fluid">
        <div className="transactions-filters">
          <div className="top-bar mb-4">
            {TABLE_DATA.type.map((item) => (
              <div
                className={classNames({
                  btn: true,
                  filter: true,
                  active: filtersData.type === item.type,
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
                  <Form className="form-group-app input-group-app transparent mb-0 row">
                    <div className="col-md p-0 pr-md-3">
                      <AccountRSForm
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
                    { filtersData.type !== "escrow" && (
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
                  filtersData.type === "escrow"
                    ? TABLE_DATA.head.escrow
                    : TABLE_DATA.head.token
                }
                className={"no-min-height"}
                emptyMessage={"No Smart Contracts found."}
                TableRowComponent={
                  filtersData.type === "escrow" ? TableItemEscrow : TableItemContract
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
