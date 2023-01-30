import React from 'react';
import classNames from 'classnames';
import InfoBox from 'containers/components/info-box';
import { BallPulse } from '../BallPulse';

const ContentLoader = ({
  noPaddingOnTheSides, noPaddingTop, className,
  pr, pt, pb, white,
}) => (
  <InfoBox
    noPaddingOnTheSides={noPaddingOnTheSides}
    noPaddingTop={noPaddingTop}
    className={className}
  >
    <div
      className={classNames({
        'loader-box': true,
        'padding-right': pr,
        'padding-top': pt,
        'padding-bottom': pb,
        white,
      })}
    >
      <BallPulse />
    </div>
  </InfoBox>
);

export default ContentLoader;
