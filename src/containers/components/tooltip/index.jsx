import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import Icon from '../../../assets/objection-mark.svg';
import styles from './index.module.scss';

export const Tooltip = ({ icon = Icon, children, className }) => {

  const tooltip = useRef(null);

  const handleHover = useCallback(() => {
    // const coords = target.getBoundingClientRect();
    // let left = coords.left + (target.offsetWidth - tooltip.current.offsetWidth) / 2;
    // if (left < 0) left = 0;
    // let top = coords.top - tooltip.current.offsetHeight - 5;
    // if (top < 70) {
    //   // 70 for the table case because if less we will not see a tooltip content
    //   top = coords.top + tooltip.current.offsetHeight -5;
    // }
    // tooltip.current.style.left = `${left}px`;
    // tooltip.current.style.top = `${top}px`;
    tooltip.current.style.visibility = 'visible';
    tooltip.current.style.zIndex = 2;
  },[tooltip.current]);

  const handleMouseOut = useCallback(() => {
    // tooltip.current.style.left = '';
    // tooltip.current.style.top = '';
    tooltip.current.style.visibility = 'hidden';
    tooltip.current.style.zIndex = -1;
  }, [tooltip.current]);

  return (
    <div className={styles.tooltip} onMouseOver={handleHover} onMouseOut={handleMouseOut}>
      <figure className={styles.tooltipIconWrapper}>
        <img className={styles.tooltipIcon} src={icon} alt='tooltip' />
      </figure>
      <div className={styles.tooltipContentWrapper}>
        <div ref={tooltip} className={classNames(styles.tooltipContent, className)}>
          {children}
        </div>
      </div>
    </div>
  )
}