import React from 'react';
import classNames from 'classnames';

const PageTitleBox = ({setBodyModalType, children, dashboardPage, pageTitle}) => (
    <div className="page-title-box">
        <div className="page-title-box transactions-title">
            <h1 className="title">{pageTitle}</h1>
            {
                children &&
                children
            }
            {
                dashboardPage &&
                <>
                    <div className="general open-settings">
                        <div onClick={(e) => setBodyModalType('FORGING_BODY_MODAL', e)}>
                            <i className="user-box-icon zmdi zmdi-chevron-down"/>
                        </div>
                    </div>
                </>
            }
        </div>
        {children && (
            <div className={'media-site-header-buttons mt-3'}>
                {React.Children.map(children, child => {
                        if (child) {
                            return React.cloneElement(child, {
                                className : classNames({
                                    'btn btn-default' : true,
                                    'mr-3': true,
                                    'd-inline' : true
                                }),
                                style: {}
                            })
                        }
                    }
                )
                }
            </div>
        )}
        
    </div>
)

export default PageTitleBox;