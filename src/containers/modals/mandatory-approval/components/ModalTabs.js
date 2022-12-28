import React from "react";
import classNames from "classnames";
// TODO remove

export default class ModalTabs extends React.Component {

    renderTabs = () => {
        return this.props.tabs.map((tab, index) => <a onClick={() => this.props.onTabSelected(index)}
                                                      className={classNames({
                                                          "form-tab": true,
                                                          "active": this.props.activeTab === index
                                                      })}>
            <span className="pre">{tab}</span>
        </a>);
    };

    render() {
        return (
            <div className="form-tabulator active">
                <div className="form-tab-nav-box justify-left">
                    {this.renderTabs()}
                </div>
                {this.props.children}
            </div>
        );
    }
}