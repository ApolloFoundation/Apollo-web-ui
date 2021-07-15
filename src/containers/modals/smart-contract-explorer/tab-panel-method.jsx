import React, { useState }from "react";
import Collapsible from "../../components/collapsible";
import Button from "containers/components/button";
import ExplorerForm from "./form";

const TabMethodPanel = ({ items, address, type }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandAll = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <div className={"mb-3 text-align-right"}>
        <Button
          size={"xs"}
          type="button"
          onClick={handleExpandAll}
          name="Show all / Expand all"
        />
      </div>
      {items.length > 0 ? (
        items.map((item) => (
          <Collapsible
            title={item.name}
            expand={expanded}
            key={item.id}
            className={"mb-3"}
          >
            {item.type !== "view" || item.inputs.length > 0 ? (
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

export default TabMethodPanel;
  