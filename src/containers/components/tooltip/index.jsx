import React, { useCallback, useRef } from "react";
import classNames from "classnames";
import Icon from "../../../assets/objection-mark.svg";
import styles from "./index.module.scss";

export const Tooltip = ({ icon = Icon, children, className, iconContent, white }) => {
  const tooltip = useRef(null);

  const handleHover = useCallback(() => {
    tooltip.current.style.visibility = "visible";
    tooltip.current.style.zIndex = 2;
  }, [tooltip.current]);

  const handleMouseOut = useCallback(() => {
    tooltip.current.style.visibility = "hidden";
    tooltip.current.style.zIndex = -1;
  }, [tooltip.current]);

  return (
    <div
      className={styles.tooltip}
      onMouseOver={handleHover}
      onMouseOut={handleMouseOut}
    >
      {iconContent ? (
        iconContent
      ) : (
        <figure className={styles.tooltipIconWrapper}>
          <img className={styles.tooltipIcon} src={icon} alt="tooltip" />
        </figure>
      )}

      <div className={styles.tooltipContentWrapper}>
        <div
          ref={tooltip}
          className={classNames(styles.tooltipContent, className, white && styles.tooltipContentwhite)}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
