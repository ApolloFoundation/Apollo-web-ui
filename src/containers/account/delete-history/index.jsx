/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getDeleteHistory } from "../../../actions/delete-history";
import { BlockUpdater } from "../../block-subscriber";
import { DeleteItem } from "./deletes/index";
import SiteHeader from '../../components/site-header'
import CustomTable from '../../components/tables/table';

const headersList = [
  {
    name: 'Transaction',
    alignRight: false
  }, 
  {
    name: 'Asset',
    alignRight: false
  },
  {
    name: 'Date',
    alignRight: false
  },
  {
    name: 'Quantity',
    alignRight: true
  }
];

export const DeleteHistory = () => {
  const dispatch = useDispatch();
  const account = useSelector(state => state.account.accountRS);
  const [state, setState] = useState({
    deletes: null,
    page: 1,
    perPage: 15,
    firstIndex: 0,
    lastIndex: 15,
    loader: false,
  });

  const getDeleteHistoryCallback = useCallback((account) => {
    dispatch(getDeleteHistory(account, state.firstIndex, state.lastIndex))
      .then(history => {
        setState(state => ({
          ...state,
          deletes: history ? history.deletes : null
        }))
      });
  }, [account, state.firstIndex, state.lastIndex]);

  const listener = useCallback(() => {
    getDeleteHistoryCallback(account);
  }, [account, getDeleteHistoryCallback]);

   
  const handlePaginate = (page) => () => {
    setState((prevState) => ({
      ...prevState,
      page,
      firstIndex: page * prevState.perPage - prevState.perPage,
      lastIndex: page * prevState.perPage
    }));
  }


  useEffect(() => {
    getDeleteHistoryCallback(account);
    BlockUpdater.on("data", listener);
    return () => {
      BlockUpdater.removeListener("data", listener)
    };
  }, [getDeleteHistoryCallback, listener]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle='Delete History' />
        <div className="page-body container-fluid">
          <CustomTable
            header={headersList}
            previousHendler={handlePaginate(state.page - 1)}
            nextHendler={handlePaginate(state.page + 1)}
            page={state.page}
            className='mb-3'
            TableRowComponent={(el) => <DeleteItem delete={el} />}
            tableData={state.deletes}
            isPaginate
            emptyMessage='No asset deletion history available.'
            itemsPerPage={state.perPage}
          />
        </div>
    </div>
  )
} 

export default DeleteHistory
 