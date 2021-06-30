import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import ExplorerForm from "./form";

const TabMethodPanel = ({ item, address, type }) => {
  const { name, inputs, value, outputs } = item;
  return (
    <Accordion allowZeroExpanded={true}>
      <AccordionItem className="mb-3">
        <AccordionItemHeading>
          <AccordionItemButton className="accordion__button p-3">
            {name}
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          {type !== "view" || inputs.length > 0 ? (
            <ExplorerForm
              methodName={name}
              type={type}
              address={address}
              fields={inputs}
            />
          ) : (
            <>
              <span>{value}</span>{" "}
              <span className="text-info">{outputs[0].type} </span>
            </>
          )}
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default TabMethodPanel;
