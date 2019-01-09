import React from 'react';
import InfoBox from '../info-box'
import ContentLoader from '../content-loader'


const ContentHendler = (props) => (
    <React.Fragment>
        {
            props.items &&
            props.items.length > 0 &&
            props.children
        }
        {
            props.items &&
            props.items.length === 0 &&
            <div>
                <InfoBox default>
                    {props.emptyMessage}
                </InfoBox>
            </div>
        }
        {
            !props.items &&
            <ContentLoader />
        }

    </React.Fragment>
);

export default ContentHendler;