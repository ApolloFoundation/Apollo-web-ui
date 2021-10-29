import React from "react";
import classNames from "classnames";

const Tab = ({
  handleClose,
  handleTab,
  activeTab,
  onFocus,
  sectionName,
  id,
  index,
}) => (
  <a
    id={id}
    onClick={(e) => {
      if (onFocus) {
        onFocus(index);
      }
      handleTab(e, index);
    }}
    className={classNames({
      "form-tab": true,
      active: activeTab === index,
    })}
    actveTab={activeTab}
  >
    <p className="pre">{sectionName}</p>
    {handleClose && (
      <span
        className="pl-4"
        onClick={(e) => {
          e.stopPropagation();
          handleClose(index);
        }}
      >
        <i className="zmdi zmdi-close" />
      </span>
    )}
  </a>
);

export default Tab;
