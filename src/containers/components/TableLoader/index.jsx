import React, { useEffect, useCallback, useState } from "react";
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../content-loader'
import CustomTable from "../tables/table";

const initialPagination = {
  page: 1,
  firstIndex: 0,
  lastIndex: 15,
};

export const TableLoader = ({
  dataLoaderCallback,
  headersList,
  emptyMessage,
  className = 'p-0',
  TableRowComponent,
  withLoader = true,
  passProps = {},
  isResetPagination,
  onResetPagination,
  isShowLoader,
  onResetLoader,
}) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(initialPagination);

  const handlePagination = useCallback((page) => () => {
    setPagination({
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15
    });
  }, []);

  const loadData = useCallback(async () => {
    const pag = {
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    }
    if (isResetPagination) {
      pag.firstIndex = 0;
      pag.lastIndex = 15;
      onResetPagination();
      setPagination(initialPagination);
    }
    const res = await dataLoaderCallback(pag);
    if (res && isShowLoader && onResetLoader ) onResetLoader();
    setData(res);
  }, [dataLoaderCallback, isShowLoader, onResetLoader , pagination.firstIndex, pagination.lastIndex, isResetPagination, onResetPagination])

  useEffect(() => {
    loadData();
    BlockUpdater.on("data", loadData);
    return () => {
      BlockUpdater.removeListener("data", loadData);
    }
  }, [loadData]);

  if (isShowLoader) return (<ContentLoader noPaddingOnTheSides />);

  if (!data && withLoader) return (<ContentLoader noPaddingOnTheSides />);

  return (
    <CustomTable
      header={headersList}
      className={className}
      emptyMessage={emptyMessage}
      TableRowComponent={TableRowComponent}
      tableData={data}
      isPaginate
      page={pagination.page}
      previousHendler={handlePagination(pagination.page - 1)}
      nextHendler={handlePagination(pagination.page + 1)}
      itemsPerPage={15}
      passProps={passProps}
    />
  )
}
