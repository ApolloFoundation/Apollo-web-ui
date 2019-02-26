import React from 'react';

const IconndeButton = ({id, action, icon}) => (
    <a
        id={id}
        className="user-account-action"
        onClick={action}
    >
        {icon}
    </a>
)

export default IconndeButton;