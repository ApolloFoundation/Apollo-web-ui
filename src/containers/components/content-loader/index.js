import React from 'react';
import classNames from 'classnames';
import InfoBox from '../info-box'

const ContentLoader = (props) => (
    <InfoBox
        noPaddingOnTheSides={props.noPaddingOnTheSides}
        onPaddingTop={props.onPaddingTop}
    >
        <div

            className={classNames({
                'loader-box': true,
                'padding-right' : props.pr,
                'padding-top': props.pt,
                'padding-bottom': props.pb,
                'white': props.white,
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