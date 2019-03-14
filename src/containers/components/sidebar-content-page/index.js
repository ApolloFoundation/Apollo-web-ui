import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class SidebarContentPage extends Component {
    state = {};

    componentDidMount = () => {
        console.log(this.props);
    }

    getBack = () => {
        const {customGetBack, history: {push}, match: {path}} = this.props;

        if (customGetBack) {
            customGetBack();
            return;
        }

        push(path.split(':')[0]);
    }

    render () {
        const {SidebarContent, PageContent, match: {params}} = this.props;
        const isGoBack = !!Object.values(params).length

        console.log(params);
        console.log(isGoBack);

        return (
            <div className="page-body container-fluid followed-polls-container">
                    <div className="row">
                        <div className="col-md-3 p-0 pb-3">
                            {
                                window.innerWidth > 769 &&
                                <SidebarContent />                         
                                ||
                                <>
                                    {
                                        !isGoBack &&
                                        <SidebarContent />                         
                                    }
                                </>
                            }
                        </div> 

                        <div className={'col-md-9 pl-sm-0 p-xs-0 pl-md-3 pr-0 pb-3'}>
                            {
                                window.innerWidth < 769 &&
                                isGoBack &&
                                <div 
                                    className={'btn primary mb-3 mt-0'} 
                                    onClick={this.getBack}
                                >
                                    <i class="zmdi zmdi-long-arrow-left"></i>&nbsp;&nbsp;
                                    Got back
                                </div>
                            }
                            {
                                window.innerWidth > 769 &&
                                <PageContent />                         
                                ||
                                <>
                                    {
                                        isGoBack &&
                                        <PageContent />                         
                                    }
                                </>

                            }
                        </div>
                    </div>
                </div>
        );
    }
}

export default withRouter(SidebarContentPage);