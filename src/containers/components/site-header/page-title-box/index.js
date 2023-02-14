import React from 'react';

const PageTitleBox = ({ children, pageTitle }) => (
    <div className="page-title-box text-ellipsis">
        <div className="page-title-box transactions-title">
            <h1 className="title">
                {pageTitle}
            </h1>
            {children}
        </div>
        {children && (
            <div className='media-site-header-buttons mt-3'>
                {React.Children.map(children, child => {
                        if (child) {
                            return React.cloneElement(child, {
                                className : 'btn btn-default mr-3 d-inline',
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