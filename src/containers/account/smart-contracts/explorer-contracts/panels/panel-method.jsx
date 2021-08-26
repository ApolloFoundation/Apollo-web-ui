import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Collapsible from "../../../../components/collapsible";
import Button from "../../../../components/button";
import ExplorerForm from "../form";
import { setBodyModalParamsAction } from "../../../../../modules/modals";

const PanelMethod = ({ items, address, type, title }) => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.smartContract);
  const [expanded, setExpanded] = useState(false);

  const handleExpandAll = () => {
    setExpanded((state) => !state);
  };

  const handleTransactionInfo = (transaction) => {
    dispatch(setBodyModalParamsAction("INFO_TRANSACTION", transaction));
  };

  return (
    <div>
      <div className={"mb-3 text-align-right"}>
        <div className="d-flex w-100 justify-content-between mb-3 pt-3 ">
          <div className="heading mb-2">{title}</div>
          <div className="title mb-2">
            <Button
              size={"xs"}
              type="button"
              onClick={handleExpandAll}
              name="Collaps all / Expand all"
            />
          </div>
        </div>
      </div>
      {items.length > 0 ? (
        items.map((item, index) => (
          <Collapsible
            title={item.name}
            expand={expanded}
            key={item.id}
            className={"mb-3"}
          >
            {type === "write" || (type === "view" && item.inputs.length > 0) ? (
              <ExplorerForm
                methodName={item.name}
                type={type}
                address={address}
                fields={item.inputs}
                formIndex={index}
              />
            ) : (
              <>
                <span>{item.value} </span>
                <span className="text-info">{item.outputs[0].type} </span>
              </>
            )}
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
          </Collapsible>
        ))
      ) : (
        <div>Empty List</div>
      )}
    </div>
  );
};

export default PanelMethod;
