import React, { useEffect, useCallback, useState } from "react";
import {BlockUpdater} from "../../block-subscriber";
import ContentLoader from '../content-loader'
import CustomTable from "../tables/table";

export const TableLoader = ({
  dataLoaderCallback,
  headersList,
  emptyMessage,
  className = 'p-0',
  TableRowComponent,
  withLoader = true, 
}) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const handlePagination = useCallback((page) => () => {
    setPagination({
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15
    });
  }, []);

  const loadData = useCallback(async () => {
    const res = await dataLoaderCallback({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    });
    setData(res);
  }, [pagination.firstIndex, pagination.lastIndex])

  useEffect(() => {
    loadData();
    BlockUpdater.on("data", loadData);
    return () => {
      BlockUpdater.removeListener("data", loadData);
    }
  }, [loadData]);

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
    />
  )
}
