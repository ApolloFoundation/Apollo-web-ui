import { TableLoader } from 'containers/components/TableLoader';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { getModalDataSelector } from 'selectors';

export const AccountTableBase = ({
  actionCallback,
  headersList,
  className,
  emptyMessage,
  TableRowComponent,
  keyField
}) => {
  const dispatch = useDispatch();
  const modalData = useSelector(getModalDataSelector);

  const handleLoadData = useCallback(async ({ firstIndex, lastIndex }) => {
    const res = await dispatch(actionCallback({
      account: modalData,
      firstIndex,
      lastIndex,
    }))
    return res?.[keyField] ?? [];
  }, 
    [modalData, dispatch, actionCallback]
  );
  
  return (
    <TableLoader
      headersList={headersList}
      className={className}
      emptyMessage={emptyMessage}
      TableRowComponent={TableRowComponent}
      dataLoaderCallback={handleLoadData}
    />
  );
}