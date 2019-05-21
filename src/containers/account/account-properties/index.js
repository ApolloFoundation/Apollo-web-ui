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

import AccountProperty from './acocunt-property';
import CustomTable from '../../components/tables/table';

const mapStateToProps = state => ({
    account: state.account.account
})

const mapDisatchToProps = dispatch => ({
    getAccountPropertiesAction: (requsetParams) => dispatch(getAccountPropertiesAction(requsetParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
})

class AccountProperties extends React.Component {
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
                    <CustomTable
                        header={[
                            {
                                name: `${this.state.incoming ? 'Setter' : 'Recipient'}`,
                                alignRight: false
                            },{
                                name: 'Property',
                                alignRight: false
                            },{
                                name: 'Value',
                                alignRight: false
                            },{
                                name: 'Actions',
                                alignRight: true
                            }
                        ]}
                        className={'mb-3'}
                        page={this.state.page}
                        emptyMessage={'No account properties found .'}
                        TableRowComponent={(props) => <AccountProperty incoming={this.state.incoming} {...props}/>}
                        tableData={this.state.properties}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDisatchToProps)(AccountProperties);