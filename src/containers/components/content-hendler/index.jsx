import React from 'react';
import InfoBox from 'containers/components/info-box';
import ContentLoader from 'containers/components/content-loader';

const ContentHendler = ({
  items, children, className, emptyMessage,
}) => (
  <>
    {/* {props.items.length === 0 && props.children} */}
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
