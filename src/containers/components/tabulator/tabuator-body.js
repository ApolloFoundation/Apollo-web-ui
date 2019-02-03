import React from 'react';
import Tab from './tab'
import classNames from 'classnames';

class TabulationBody extends React.Component {

    state = {activeTab : 0};

    handleTab = (e, index) => {
        e.preventDefault();
        console.log(index)
        this.setState({
            activeTab: index
        })
    }

    render () {
        const {children} = this.props;
        console.log(children)
        return (
            <>
                <div className="form-tabulator active">
                
                    {/** Render tabulator header */}
                    <div className="form-tab-nav-box justify-left">
                        {
                            React.Children.map(children, (child, index) =>
                                <>
                                    {
                                        child && 
                                        <Tab 
                                            handleTab={this.handleTab}
                                            sectionName={child.props.sectionName} 
                                            activeTab={this.state.activeTab} 
                                            index={index}
                                        />
                                    }
                                </>
                            )
                        }
                    </div>

                    {/** Render tabulator body */}
                    {
                        React.Children.map(children, (child, index) => 
                            <div 
                                className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === index
                                })}
                            >
                                {console.log(index)}
                                {child}
                            </div>
                        )
                    }
                </div>

                
                
            </>
        )
    }
}

export default TabulationBody;