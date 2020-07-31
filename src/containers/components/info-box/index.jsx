/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import cn from 'classnames';

const InfoBox = ({
  attentionLeft, nowrap, warning: isWarning, children,
  danger, info, default: defaultValue, mt, onPaddingTop,
  noPaddingOnTheSides, className,
}) => (
  <div
    className={`${cn({
      'attention-left': attentionLeft,
      'info-box': true,
      'blue-info': info,
      'no-padding-top': onPaddingTop,
      'no-padding-on-the-sides': noPaddingOnTheSides,
      nowrap,
      danger,
      mt,
      warning: isWarning,
      info: defaultValue,
    })} ${className}`}
  >
    {children}
  </div>
);

export default InfoBox;
