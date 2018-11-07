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
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'
import classNames from "classnames";
import FundingMonitorItem from "./funding-monitor-status-item";

const mapStateToProps = state => ({
    account: state.account.account
})

const mapDisatchToProps = dispatch => ({
    getAccountPropertiesAction: (requsetParams) => dispatch(getAccountPropertiesAction(requsetParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
})

class FundingMonitorsStatus extends React.Component {
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
        this.getAccountProperties(this.props);
    }

    componentWillReceiveProps (newState) {
        this.getAccountProperties(newState);
    }

    getAccountProperties = async (newState) => {
        if (!newState) newState = this.props;

        const properties = await this.props.getAccountPropertiesAction({
            setter: newState.match.params.account,
            property: newState.match.params.property,
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
                    pageTitle={'Funding Monitor Status'}
                >
                    <a
                        className={classNames({
                            'btn': true,
                            'primary': true,
                            'disabled' : this.state.isPrivate
                        })}
                        onClick={() => {
                            this.props.setModalType('PrivateTransactions')

                        }}
                    >
                        Funding monitors
                    </a>
                    <a
                        className={classNames({
                            'btn': true,
                            'primary': true,
                            'disabled' : this.state.isPrivate
                        })}
                        onClick={() => {
                            this.props.setBodyModalParamsAction('ADD_MONITORED_ACCOUNT')

                        }}
                    >
                        Add Monitored Account
                    </a>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="funding-monitors">
                        <ContentHendler
                            items={this.state.properties}
                            emptyMessage={'No properties found.'}
                        >
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
                                                    <FundingMonitorItem {...el}/>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </ContentHendler>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDisatchToProps)(FundingMonitorsStatus);