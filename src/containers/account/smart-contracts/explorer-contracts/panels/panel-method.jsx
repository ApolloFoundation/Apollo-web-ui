import React, { useState } from "react";
import Collapsible from "../../../../components/collapsible";
import Button from "../../../../components/button";
import ExplorerForm from "../form";

const PanelMethod = ({ items, address, type, title }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandAll = () => {
    setExpanded(!expanded);
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
        items.map((item) => (
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
              />
            ) : (
              <>
                <span>{item.value}</span>{" "}
                <span className="text-info">{item.outputs[0].type} </span>
              </>
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
