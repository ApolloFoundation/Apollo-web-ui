/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header';
import {connect} from 'react-redux';
import uuid from 'uuid';
import {getAccountPropertiesAction} from '../../../actions/account/index';
import InfoBox from '../../components/info-box';
import {setBodyModalParamsAction} from "../../../modules/modals";

const mapStateToProps = state => ({
    account: state.account.account
})

const mapDisatchToProps = dispatch => ({
    getAccountPropertiesAction: (requsetParams) => dispatch(getAccountPropertiesAction(requsetParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
})

class AccountProperties extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        properties: null,
        firstIndex: 0,
        lastIndex: 14,
        page: 1,
        recipientRS: null,
        setterRS: null,
        incoming: true
    };

    componentDidMount() {
        this.getAccountPropertiesIncoming(this.props);
    }

    componentWillReceiveProps (newState) {
        if (this.state.incoming) this.getAccountPropertiesIncoming(newState);
        else this.getAccountPropertiesOutgoing(newState);
    }

    getAccountPropertiesIncoming = async (newState) => {
        if (!newState) newState = this.props;
        const properties = await this.props.getAccountPropertiesAction({
            recipient: newState.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
        });

        if (properties) {
            this.setState({
                properties: properties.properties,
                recipientRS: properties.recipientRS,
                incoming: true
            })
        }
    };

    getAccountPropertiesOutgoing = async (newState) => {
        if (!newState) newState = this.props;
        const properties = await this.props.getAccountPropertiesAction({
            setter: newState.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
        });

        if (properties) {
            this.setState({
                properties: properties.properties,
                setterRS: properties.setterRS,
                incoming: false
            })
        }
    };

    setProperty  = (el) => this.props.setBodyModalParamsAction("SET_ACCOUNT_PROPERTY", el);

    deleteProperty  = (el) => {
        const data = el;
        if (this.state.incoming) data.recipientRS = this.state.recipientRS;
        else data.setterRS = this.state.setterRS;
        this.props.setBodyModalParamsAction("DELETE_ACCOUNT_PROPERTY", data);
    };

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Account properties'}
                >
                    <a className={`btn ${this.state.incoming ? 'outline-primary' : 'outline-transparent'} mr-1`}
                       onClick={() => this.getAccountPropertiesIncoming()}>
                        Incoming
                    </a>
                    <a className={`btn ${this.state.incoming ? 'outline-transparent' : 'outline-primary'} mr-1`}
                       onClick={() => this.getAccountPropertiesOutgoing()}>
                        Outgoing
                    </a>
                    <a className="btn primary"
                       onClick={this.setProperty}>
                        Set
                    </a>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        {
                            this.state.properties &&
                            !!this.state.properties.length &&
                            <div className="transaction-table">
                                <div className="transaction-table-body">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>{this.state.incoming ? 'Setter' : 'Recipient'}</td>
                                            <td>Property</td>
                                            <td>Value</td>
                                            <td className="align-right">Actions</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.properties &&
                                            this.state.properties.length &&
                                            this.state.properties.map((el) => {
                                                return (
                                                    <tr key={uuid()}>
                                                        <td className="blue-link-text">
                                                            <a
                                                                onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', el.setter)}
                                                            >
                                                                {this.state.incoming ? el.setterRS : el.recipientRS}
                                                            </a>
                                                        </td>
                                                        <td>{el.property}</td>
                                                        <td>{el.value}</td>
                                                        <td className="align-right">
                                                            <div className="btn-box inline">
                                                                {(this.state.recipientRS === el.setterRS || !this.state.incoming) &&
                                                                <a onClick={() => this.setProperty(el)}
                                                                   className="btn primary blue">Update</a>
                                                                }
                                                                <a onClick={() => this.deleteProperty(el)}
                                                                   className="btn primary">Delete</a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                        </tbody>
                                    </table>

                                </div>
                            </div> ||
                            <div className={'loader-box'}>
                                <div className="ball-pulse">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        }
                        {
                            this.state.properties &&
                            !!(!this.state.properties.length) &&
                            <InfoBox default>
                                No properties found.
                            </InfoBox>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDisatchToProps)(AccountProperties);