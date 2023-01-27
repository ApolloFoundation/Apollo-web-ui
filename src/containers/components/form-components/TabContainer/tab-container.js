import React from 'react';
import classNames from 'classnames';

export const TabContainer = (props) => {
    const {children, active, onFocus} = props;

    return (
        <React.Fragment>
            {
                active &&
                <div
                    onClick={() => onFocus ? onFocus() : () => {}}
                    className={classNames({
                        "tab-body": true,
                        "active": active
                    })}
                >
                    <div className="form-tab">
                        {children}
                    </div>
                </div>
            }
        </React.Fragment>
        
    )
}