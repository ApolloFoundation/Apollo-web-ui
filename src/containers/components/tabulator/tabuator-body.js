import React from "react";
import classNames from "classnames";
import Tab from "./tab";

class TabulationBody extends React.Component {
  state = { activeTab: 0 };

  componentDidMount() {
    if (this.props.active) {
      this.setState({ activeTab: this.props.active });
    }
  }
  handleTab = (e, index) => {
    e.preventDefault();
    this.setState({
      activeTab: index,
    });
    if (this.props.onChange) this.props.onChange(e, index);
  };

  render() {
    const { children, className } = this.props;

    return (
      <>
        <div className={`form-tabulator active h-100 ${className}`}>
          {/** Render tabulator header */}
          <div className="form-tab-nav-box justify-left">
            {React.Children.map(children, (child, index) => (
              <>
                {child && (
                  <Tab
                    id={child.props.id}
                    key={index}
                    handleTab={this.handleTab}
                    sectionName={child.props.sectionName}
                    activeTab={this.state.activeTab}
                    index={index}
                    onFocus={this.props.onFocus}
                  />
                )}
              </>
            ))}
          </div>

          {/** Render tabulator body */}
          {React.Children.map(children, (child, index) => {
            if (this.state.activeTab === index) {
              return (
                <div
                  key={index}
                  className={classNames({
                    "tab-body": true,
                    active: true,
                  })}
                >
                  {child}
                </div>
              );
            }
          })}
        </div>
      </>
    );
  }
}

export default TabulationBody;
