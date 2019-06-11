import React from 'react';

const IconndeButton = ({id, action, icon}) => (
    <span
        id={id}
        className="header-action cursor-pointer"
        onClick={action}
    >
        {icon}
    </span>
);

export default IconndeButton;