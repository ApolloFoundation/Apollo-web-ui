import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./collapsible.sass";

const Collapsible = ({ title, expand, children, className }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (expand) {
      setOpen(false);
    }
  }, [expand]);

  const handleToggleCollapsible = () => {
    setOpen(!open)
  }

  return (
    <div
      className={classNames({
        collapsible: true,
        [`${className}`]: className,
      })}
    >
      <div className="collapsible-heading" onClick={handleToggleCollapsible}>
        <div className="collapsible-icon">
          <i
            className={classNames({
              zmdi: true,
              "zmdi zmdi-chevron-down": expand || open,
              "zmdi zmdi-chevron-right": !(expand || open),
            })}
          />
        </div>
        <div className="collapsible-text">{title}</div>
      </div>
      {expand || open ?
        <div className="collapsible-content">
          {children}
        </div> : ''
      }

    </div>
  );
};
export default Collapsible;
