import React from 'react';
import classNames from 'classnames';
import InfoBox from 'containers/components/info-box';

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
      <div className="ball-pulse">
        <div />
        <div />
        <div />
      </div>
    </div>
  </InfoBox>
);

export default ContentLoader;
