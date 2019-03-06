import React, {Component} from 'react';
import classNames from 'classnames';
import {Form, Text} from 'react-form';
import InputMask from 'react-input-mask'
import {connect} from 'react-redux';
import {getDGSTagsAction,} from '../../../../actions/marketplace'
import uuid from 'uuid';
import {Link} from 'react-router-dom';

class MarketplaceTags extends Component {
    state = {};

    componentDidMount = () => {
        // this.getInitialData({
        //     buyer: this.props.account
        // });
        // this.getDGSGoods({
        //     firstIndex: 0,
        //     lastIndex: 5,
        //     completed: true
        // });
        this.getDGSTags({
            firstIndex: 0,
            lastIndex: 9,
            completed: true
        });
    }

    componentWillReceiveProps = (newProps) => {
        if (this.state.isShowMore){
            this.setState({
                page: 1,
                firstIndex: 0,
                lastIndex: 31
            })
            this.getDGSTags({
                firstIndex: 0,
                lastIndex: 31
            })
        } else {
            this.setState({
                page: 1,
                firstIndex: 0,
                lastIndex: 9
            })
            this.getDGSTags({
                firstIndex: 0,
                lastIndex: 9
            })
        }
    }

    getDGSTags = async (reqParams) => {
        const getDGSTags = await this.props.getDGSTagsAction(reqParams);

        if (getDGSTags) {
            this.setState({
                ...this.state,
                getDGSTags: getDGSTags.tags
            })
        }
    };

    handleSearchByTag = (values) => {
        if (values.tag) {
            this.props.history.push('/marketplace/' + values.tag)
        }
    };

    handleSearchByAccount = (values) => {
        if (values) {
            this.props.history.push('/marketplace/' + values.seller)
        }
    };

    showMoreController = () => {
        this.setState({

        })
    }

    onPaginate = (page) => {
        let reqParams = {
            page: page,
            firstIndex: page * 32 - 32,
            lastIndex:  page * 32 - 1
        };

        this.setState({...this.state,...reqParams}, () => {
            this.getDGSTags(reqParams)
        });
    };

    render () {

        const {showMoreController, isShowMore} = this.props;

        return (
            <div className="card  marketplace filters transparent">
                <div className="search-bar m-0">
                    <div className="row m-0">
                        <div className={classNames({
                            'col-md-12 pr-0 pl-0' : !isShowMore,
                            'col-md-6 pr-0 pl-0' : isShowMore
                        })}>
                            <div className="input-group-app search tabled">
                                <Form
                                    onSubmit={(values) => this.handleSearchByAccount(values)}
                                    render={({
                                                submitForm, values, addValue, removeValue, setValue, getFormState
                                            }) => (
                                            <form
                                                className="iconned-input-field"
                                                onSubmit={submitForm}
                                            >
                                                <InputMask mask='APL-****-****-****-*****' value={this.state.value}  onChange={(e) => {if (e.target) setValue('recipient', e.target.value)}}>
                                                    {(inputProps) => {
                                                        return (
                                                            <Text  {...inputProps} field="seller" placeholder="Seller`s Account ID" />
                                                        );
                                                    }}
                                                </InputMask>
                                                <button className="input-icon">
                                                    <i className="zmdi zmdi-search" />
                                                </button>
                                            </form>
                                        )}
                                />

                            </div>
                        </div>
                        <div className={classNames({
                            'col-md-12 pr-0 pl-0' : !this.state.isShowMore,
                            'col-md-6 pr-0 pl-0' : this.state.isShowMore
                        })}>
                            <div className="input-group-app search tabled">
                                <Form
                                    onSubmit={(values) => this.handleSearchByTag(values)}
                                    render={({
                                                submitForm, values, addValue, removeValue, setValue, getFormState
                                            }) => (
                                            <form
                                                className="iconned-input-field"
                                                onSubmit={submitForm}
                                            >
                                                <Text field="tag" placeholder="Title, description or Tag" />

                                                <button className="input-icon">
                                                    <i className="zmdi zmdi-search" />
                                                </button>
                                            </form>
                                        )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="filters-bar" ref={'filtersBar'}>
                    {
                        this.state.getDGSTags &&
                        this.state.getDGSTags.map((el, index) => {
                            return (
                                <Link key={uuid()} to={'/marketplace/' + el.tag} className="btn primary">{el.tag}&nbsp;[{el.totalCount}]</Link>
                            );
                        })
                    }
                    <a 
                        onClick={showMoreController} 
                        className="btn primary blue" 
                        dangerouslySetInnerHTML={{__html: this.state.isShowMore ? 'View less' : 'View more'}}
                    />
                    {
                        this.state.getDGSTags && isShowMore &&
                        <div
                            ref={'btnBox'}
                            className="btn-box"
                            style={{
                                overflow: 'auto',
                                height: 52,
                                position: 'relative'
                            }}
                        >
                            <a
                                className={classNames({
                                    'btn' : true,
                                    'btn-left' : true,
                                    'disabled' : this.state.page <= 1
                                })}
                                onClick={this.onPaginate.bind(this, this.state.page - 1)}
                            > 
                                Previous
                            </a>
                            <div className='pagination-nav'>
                                <span>{this.state.firstIndex + 1}</span>
                                <span>&hellip;</span>
                                <span>{this.state.lastIndex + 1}</span>
                            </div>
                            <a
                                onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                className={classNames({
                                    'btn' : true,
                                    'btn-right' : true,
                                    'disabled' : this.state.getDGSTags.length < 32
                                })}
                            >
                                Next
                            </a>
                        </div>
                    }
                </div>
            </div> 
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getDGSTagsAction: (reqParams) => dispatch(getDGSTagsAction(reqParams)),
});


export default connect(null, mapDispatchToProps)(MarketplaceTags)