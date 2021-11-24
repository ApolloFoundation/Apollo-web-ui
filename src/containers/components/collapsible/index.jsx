import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./collapsible.scss";

const Collapsible = ({ title, expand, children, className, id, active }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(expand);
  }, [expand, active]);

  const handleToggleCollapsible = () => {
    setOpen(state => !state);
  };

  return (
    <div
      className={classNames("collapsible", className)}
      id={`collapsible-heading-${id}`}
    >
      <div className="collapsible-heading" onClick={handleToggleCollapsible}>
        <div className="collapsible-icon">
          <i
            className={classNames({
              zmdi: true,
              "zmdi zmdi-chevron-down": open,
              "zmdi zmdi-chevron-right": !open,
            })}
          />
        </div>
        <div className="collapsible-text">{title}</div>
      </div>
      {open && <div className="collapsible-content">{children}</div>}
    </div>
  );
};
export default Collapsible;
