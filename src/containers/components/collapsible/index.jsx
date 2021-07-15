import React, { useEffect } from "react";
import classNames from "classnames";
import "./collapsible.sass";

const Collapsible = ({ title, expand, children, className }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (expand) {
      setOpen(false);
    }
  }, [expand]);

  return (
    <div
      className={classNames({
        collapsible: true,
        [`${className}`]: className,
      })}
    >
      <div className={"collapsible-heading"} onClick={() => setOpen(!open)}>
        <div className={"collapsible-icon"}>
          <i
            className={classNames({
              zmdi: true,
              "zmdi zmdi-chevron-down": expand || open,
              "zmdi zmdi-chevron-right": !(expand || open),
            })}
          />
        </div>
        <div className={"collapsible-text"}>{title}</div>
      </div>
      <div
        className={classNames({
          "collapsible-content": true,
          show: expand || open,
        })}
      >
        {children}
      </div>
    </div>
  );
};
export default Collapsible;
