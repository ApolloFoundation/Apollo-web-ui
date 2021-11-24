import React from "react";
import Tab from "./tab";
import classNames from "classnames";

class TabulationBody extends React.Component {
  state = { activeTab: 0 };

  componentDidMount() {
    if (this.props.active) {
      this.setState({ activeTab: this.props.active });
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.active !== prevProps.active) {
      this.setState({ activeTab: this.props.active });
    }
  }

  handleTab = (e, index) => {
    e.preventDefault();
    this.setState({
      activeTab: index,
    });
    if (this.props.onChange) {
      this.props.onChange(e, index);
    }
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
                    handleClose={this.props.handleClose}
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
          {React.Children.map(children, (child, index) => (
            <div
              className={classNames({
                "tab-body": true,
                active: this.state.activeTab === index,
              })}
            >
              {child}
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default TabulationBody;
