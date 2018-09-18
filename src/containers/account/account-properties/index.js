import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux'
import {getAccountPropertiesAction} from '../../../actions/account/index'
import async from "../../../helpers/util/async";
import InfoBox from '../../components/info-box'
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

    };

    componentDidMount() {
        this.getAccountPropertiesAction(this.props);
    }

    componentWillReceiveProps (newState) {
        this.getAccountPropertiesAction(newState);
    }

    getAccountPropertiesAction = async (newState) => {
        const properties = await this.props.getAccountPropertiesAction({
            recipient: newState.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
        })

        if (properties) {
            console.log(properties);

            this.setState({
                properties: properties.properties
            })
        }
    }

    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Account properties'}
                />
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
                                            <td>Setter</td>
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
                                                    <tr>
                                                        <td className="blue-link-text">
                                                            <a
                                                                onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', el.setter)}
                                                            >
                                                                {el.setterRS}
                                                            </a>
                                                        </td>
                                                        <td>{el.property}</td>
                                                        <td>{el.value}</td>
                                                        <td className="align-right">
                                                            <div className="btn-box inline">
                                                                <a onClick={() => this.props.setBodyModalParamsAction('SET_ACCOUNT_PROPERTY', el)} className="btn primary blue">Update</a>
                                                                <a className="btn primary">Delete</a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                        </tbody>
                                    </table>

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