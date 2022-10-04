import React, { useEffect, useCallback, useState } from "react";
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../content-loader'
import CustomTable from "../tables/table";

const initialPagination = (perPage) => ({
  page: 1,
  firstIndex: 0,
  lastIndex: perPage,
});

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
  itemsPerPage = 15,
}) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(initialPagination(itemsPerPage));

  const handlePagination = useCallback((page) => () => {
    console.log("🚀 ~ file: index.jsx ~ line 29 ~ handlePagination ~ page", page)
    setPagination({
      page,
      firstIndex: page * itemsPerPage - itemsPerPage,
      lastIndex: page * itemsPerPage,
    });
  }, [itemsPerPage]);

  const loadData = useCallback(async () => {
    const pag = {
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    }
    if (isResetPagination) {
      pag.firstIndex = 0;
      pag.lastIndex = itemsPerPage;
      onResetPagination();
      setPagination(initialPagination(itemsPerPage));
    }
    const res = await dataLoaderCallback(pag);
    setData(res);
  }, [dataLoaderCallback, pagination.firstIndex, pagination.lastIndex, isResetPagination, onResetPagination, itemsPerPage])

  useEffect(() => {
    loadData();
    BlockUpdater.on("data", loadData);
    return () => {
      BlockUpdater.removeListener("data", loadData);
    }
  }, [loadData]);

  // manual loader show handler
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
      itemsPerPage={itemsPerPage}
      passProps={passProps}
    />
  )
}
