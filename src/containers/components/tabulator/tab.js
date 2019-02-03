import React from 'react';
import classNames from 'classnames';

const Tab = ({handleTab, activeTab, sectionName, index}) => (
    <a 
        onClick={(e) => handleTab(e, index)} 
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