import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../components/button";
import { setBodyModalParamsAction } from "../../../../../modules/modals";
import { removeTransaction } from "../../../../../modules/smartContract";
const PanelMethod = ({ type, index }) => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.smartContract);

  console.log(transactions);
  useEffect(() => {
    dispatch(removeTransaction(index))
  }, []);

  const handleTransactionInfo = (transaction) => {
    dispatch(setBodyModalParamsAction("INFO_TRANSACTION", transaction));
  };

  return (
    <div>
      {type === "write" && transactions[index] && (
        <div>
          transaction id:
          <Button
            color="blue-link"
            onClick={() => handleTransactionInfo(transactions[index])}
            name={transactions[index]}
          />
        </div>
      )}
    </div>
  );
};

export default PanelMethod;
