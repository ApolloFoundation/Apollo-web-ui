import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

class SidebarContentPage extends PureComponent {
    state = {};

    getBack = () => {
      const { customGetBack, history: { push }, match: { path } } = this.props;

      if (customGetBack) {
        customGetBack();
        return;
      }

      push(path.split(':')[0]);
    };

    render() {
      const {
        SidebarContent, PageContent, match: { params },
        pageContentClassName, backButtonClassname, className,
      } = this.props;
        // const isGoBack = !!Object.values(params).length;
      const isGoBack = !!params.chat;

      return (
        <div className={`page-body container-fluid followed-polls-container pl-0 sidebar-content-page ${className}`}>
          <div className="row">
            {(window.innerWidth > 767 || !isGoBack) && (
            <div className="col-md-3 p-0 mb-3">
              <SidebarContent params={params} />
            </div>
            )}

            <div className={`col-md-9 pb-3 ${pageContentClassName || 'pl-0'}`}>
              {window.innerWidth < 767 && isGoBack && (
                <div
                  className={`btn btn-default mb-3 mt-0  ${backButtonClassname}`}
                  onClick={this.getBack}
                >
                  <i className="zmdi zmdi-long-arrow-left" />
                  &nbsp;&nbsp;
                  Back to list
                </div>
              )}
              {(window.innerWidth > 767 || isGoBack) && (
                <PageContent />
              )}
            </div>
          </div>
        </div>
      );
    }
}

export default withRouter(SidebarContentPage);
