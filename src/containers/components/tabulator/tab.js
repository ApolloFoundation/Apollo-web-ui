import React from 'react';
import classNames from 'classnames';

const Tab = ({handleTab, activeTab, onFocus, sectionName, index}) => (
    <a 
        onClick={(e) => {
            if (onFocus) {
                onFocus(index)
            }
            handleTab(e, index)
        }} 
        className={classNames({
            "form-tab": true,
            "active": activeTab === index
        })}
        actveTab={activeTab}
    >
        <p className="pre">{sectionName}</p>
    </a>
)

export default Tab;