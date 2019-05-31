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
                    <div 
                        className={classNames({
                            "general": true,
                            "open-settings": true
                        })}
                    >
                        <div
                            onClick={(e) => setBodyModalType('FORGING_BODY_MODAL', e)}
                            className={classNames({
                                "underscore": true,
                                "btn": true,
                                "stop": true,
                                "icon-button": true,
                                "filters": true,
                                "FORGING_BODY_MODAL": true,
                                // "active": this.state.bodyModalType === "FORGING_BODY_MODAL",
                                // "revert-content": this.state.bodyModalType === "FORGING_BODY_MODAL",
                                "primary": true,
                                "transparent": true,
                            })}
                        >
                            <i className="to-revert stop zmdi zmdi-chevron-down"/>
                        </div>
                    </div>
                </>
            }
            <div className="breadcrumbs">
                <a>Apollo Wallet /</a>&nbsp;
                <strong>
                    <a>{pageTitle}</a>
                </strong>
            </div>
        </div>
        <div className={'media-site-header-buttons mt-3'}>
            {
                children &&
                React.Children.map(children, child => {
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
        
    </div>
)

export default PageTitleBox;