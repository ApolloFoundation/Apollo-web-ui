import React from 'react';
import classNames from 'classnames';

const PageTitleBox = ({children, pageTitle}) => (
    <div className="page-title-box text-ellipsis">
        <div className="page-title-box transactions-title">
            <h1 className="title" dangerouslySetInnerHTML={{__html: pageTitle}} />
            {
                children &&
                children
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