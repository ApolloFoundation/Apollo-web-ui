import React from 'react';

const IconndeButton = ({id, action, icon, text, link, className}) => (
    link ? (
        <a
            id={id}
            className={`header-action cursor-pointer ${text ? 'header-action-text' : ''} ${className}`}
            href={action}
            target={'_blank'}
            rel={'noopener noreferrer'}
        >
            {icon}
            {text}
        </a>
    ) : (
        <span
            id={id}
            className={`header-action cursor-pointer ${text ? 'header-action-text' : ''} ${className}`}
            onClick={action}
        >
        {icon}
            {text}
    </span>
    )
);

export default IconndeButton;