import React from 'react';
import classNames from 'classnames';
import InfoBox from '../info-box';

const ContentLoader = ({
  noPaddingOnTheSides, onPaddingTop, className,
  pr, pt, pb, white,
}) => (
  <InfoBox
    noPaddingOnTheSides={noPaddingOnTheSides}
    onPaddingTop={onPaddingTop}
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
      <div className="ball-pulse">
        <div />
        <div />
        <div />
      </div>
    </div>
  </InfoBox>
);

export default ContentLoader;
