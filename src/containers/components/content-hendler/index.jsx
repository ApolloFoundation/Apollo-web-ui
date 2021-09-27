import React from 'react';
import InfoBox from '../info-box';
import ContentLoader from '../content-loader';

const ContentHendler = ({
  items, children, className, emptyMessage,
}) => (
  <>
    {
      items
      && items.length > 0
      && children
    }
    {items && items.length === 0 && (
      <>
        {children}
        <InfoBox default className={className}>
          {emptyMessage}
        </InfoBox>
      </>
    )}
    {!items && (
      <ContentLoader />
    )}

  </>
);

export default ContentHendler;
