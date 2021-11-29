import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertToToken } from "../../../../helpers/converters";
import Collapsible from "../../../components/collapsible";
import Button from "../../../components/button";
import ExplorerForm from "./form";
import { setBodyModalParamsAction } from "../../../../modules/modals";

const PanelMethod = ({ items, address, type, title, token, active }) => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.smartContract);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [active]);

  const handleExpandAll = () => {
    setExpanded((state) => !state);
  };

  const handleTransactionInfo = useCallback((transaction) => {
      dispatch(setBodyModalParamsAction("INFO_TRANSACTION", transaction));
    },[dispatch]);

  return (
    <div>
      <div className={"mb-3 text-align-right"}>
        <div className="d-flex w-100 justify-content-between mb-3 pt-3 ">
          <div className="heading mb-2">{title}</div>
          <div className="title mb-2">
            <Button
              id="button-expand-method-explorer-smart-contracts"
              size={"xs"}
              type="button"
              onClick={handleExpandAll}
              name="Collaps all / Expand all"
            />
          </div>
        </div>
      </div>
      {items.length > 0 &&
        items.map((item, index) => (
          <Collapsible
            id={`${item.name}-${index}-explorer-smart-contracts`}
            title={item.name}
            expand={expanded}
            active={active}
            key={item.id}
            className={"mb-3"}
          >
            {type === "write" || (type === "view" && item.inputs.length > 0) ? (
              <ExplorerForm
                id={`${item.name}-${index}-explorer-smart-contracts`}
                methodName={item.name}
                type={type}
                address={address}
                fields={item.inputs}
                formIndex={index}
                token={token}
              />
            ) : (
              <>
                <span>
                  {item.outputs[0].type === "uint" && !(item.name === "releaseTime" || item.name === "decimals") ? (
                    <div className="mb-1">
                      <span className="text-info">
                        {convertToToken(item.value, 8, true)}&nbsp;
                      </span>
                      {token.value}&nbsp; 
                      <span className="text-info">
                        ({Number(item.value).toLocaleString("en", {
                          useGrouping: true,
                        })})
                      </span>
                    </div>
                  ) : (
                    <>
                      {item.value}&nbsp;
                      <span className="text-info">
                        {item.outputs[0].type.toLocaleString("en", {
                          useGrouping: true,
                        })}
                      </span>
                    </>
                  )}
                </span>
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
        ))}
    </div>
  );
};

export default PanelMethod;
