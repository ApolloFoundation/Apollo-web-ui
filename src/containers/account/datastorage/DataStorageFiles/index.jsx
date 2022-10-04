import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAccountTaggedDataAction,
  getAllTaggedDataAction,
  searchTaggedDataAction
} from "../../../../actions/datastorage";
import { TableLoader } from "../../../components/TableLoader";
import DataStorageItem from '../datastorage-item';
import cancelAxiosRequest from '../../../../helpers/cancelToken';

export const DataStorageFiles = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [isReset, setIsReset] = useState(false);

  const getParams = useCallback(() => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.get('query');

    if (!query) return ['empty', null];
    return query.split('=');
  }, [params]);
  
  const getAllTaggedData = useCallback(async ({ firstIndex, lastIndex }) => {
    const pagination = {
      firstIndex,
      lastIndex,
    };

    let [target, value ] = getParams();

    const request = {
      tag: searchTaggedDataAction({ tag: value, ...pagination }),
      account: getAccountTaggedDataAction({ account: value,  ...pagination }),
      query: searchTaggedDataAction({ query: value, ...pagination }),
      empty: getAllTaggedDataAction(pagination),
    }

    const res = await dispatch(request[target]);
    return res?.data;
  }, [dispatch, getParams]);

  const handleResetPagination = useCallback(() => {
    setIsReset(false);
  }, [setIsReset])

  useEffect(() => {
    setIsReset(true);
    cancelAxiosRequest.cancelRequests();
  }, [getParams()[0], getParams()[1]]);

  return (
    <TableLoader
      headersList={[
          {
              name: 'Name',
              alignRight: false
          }, {
              name: 'Account ID',
              alignRight: false
          }, {
              name: 'Mime Type',
              alignRight: false
          }, {
              name: 'Channel',
              alignRight: false
          }, {
              name: 'Filename',
              alignRight: false
          }, {
              name: 'Data',
              alignRight: true
          }
      ]}
      className='mb-3'
      emptyMessage='No tagget data found.'
      TableRowComponent={DataStorageItem}
      dataLoaderCallback={getAllTaggedData}
      isResetPagination={isReset}
      onResetPagination={handleResetPagination}
      itemsPerPage={15}
    /> 
  );
}