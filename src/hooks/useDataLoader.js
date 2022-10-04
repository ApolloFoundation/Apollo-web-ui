import { useCallback, useEffect, useState } from "react"
import {BlockUpdater} from "../containers/block-subscriber";

const initialPagination = (perPage) => ({
  page: 1,
  firstIndex: 0,
  lastIndex: perPage - 1,
});

export const useDataLoader = (callback, itemsPerPage = 15) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(initialPagination(itemsPerPage));

  const handlePagination = useCallback((page) => {
    setPagination({
      page,
      firstIndex: page * itemsPerPage - itemsPerPage,
      lastIndex: page * itemsPerPage - 1,
    });
  }, [itemsPerPage]);

  const handleNextPage = useCallback(
    () => handlePagination(pagination.page + 1),
    [pagination.page, handlePagination]
  );
  
  const handlePrevPage = useCallback(
    () => handlePagination(pagination.page - 1),
    [pagination.page, handlePagination]
  );

  const loadData = useCallback(async () => {
    const pag = {
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    }
    const res = await callback(pag);
    setData(res);
  }, [callback, pagination.firstIndex, pagination.lastIndex])

  
  useEffect(() => {
    loadData();
    BlockUpdater.on("data", loadData);
    return () => {
      BlockUpdater.removeListener("data", loadData);
    }
  }, [loadData]);

  return {
    data,
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    isDisabledPrev: pagination.page === 1,
    isDisabledNext: !data || data.length < itemsPerPage,
    firstCount: pagination.page * itemsPerPage - itemsPerPage + 1,
    lastCount: pagination.page * itemsPerPage - itemsPerPage + (data?.length > 0 ? data?.length : 1),
  }
}