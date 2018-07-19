import React from 'react';
import {connect} from 'react-redux';
import {getAliasesAction} from "../../../actions/aliases";
import SiteHeader from '../../components/site-header'
import classNames from "classnames";

class ActivePools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            aliases: [],
            firstIndex: 0,
            lastIndex: 14,
            page: 1
        };

    }

    componentDidMount() {
        this.getAliases({
            account:    this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex,
        });
    }

    componentWillReceiveProps(newState) {
        this.setState({...newState},() => {
            this.getAliases({
                account:    this.props.account,
                firstIndex: this.state.firstIndex,
                lastIndex:  this.state.lastIndex,
            });
        });
    }

    async getAliases(reqParams){
        const aliases = await this.props.getAliasesAction(reqParams);

        if (aliases) {
            this.setState({
                ...this.props,
                aliases: aliases.aliases
            });
        }
    }


    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Active Pools'}
                />
                <div className="page-body container-fluid">
                    <div className="active-pools white-space">
                        <div className="transaction-table no-min-height">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td>Title</td>
                                        <td>Description</td>
                                        <td>Sender</td>
                                        <td>Start date</td>
                                        <td>Blocks left</td>
                                        <td className="align-right">Actions</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="blue-link-text">
                                                <a>Lambo or Pay off Mortgage</a>
                                            </td>
                                            <td className={""}>
                                                Lambo/Rari or Pay off Mortgage
                                            </td>
                                            <td className={""}>
                                                <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                            </td>
                                            <td className={""}>
                                                6/30/2018  23:18:09
                                            </td>
                                            <td className={""}>
                                                3,989
                                            </td>
                                            <td className={"align-right"}>
                                                <div className="btn-box inline">
                                                    <a className="btn primary blue">Vote</a>
                                                    <a className="btn primary blue">Follow</a>
                                                    <a className="btn primary blue">View</a>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="form-group offset-bottom height-auto no-padding">
                            <div className="form-title padding-left">
                                <p>Finished pools</p>
                            </div>
                            <div className="transaction-table no-min-height">
                                <div className="transaction-table-body offset-bottom">
                                    <table>
                                        <thead>
                                        <tr>
                                            <td>Title</td>
                                            <td>Description</td>
                                            <td>Sender</td>
                                            <td>Start date</td>
                                            <td>Blocks left</td>
                                            <td className="align-right">Actions</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="blue-link-text">
                                                    <a>Lambo or Pay off Mortgage</a>
                                                </td>
                                                <td className={""}>
                                                    Lambo/Rari or Pay off Mortgage
                                                </td>
                                                <td className={""}>
                                                    <a>APL-KUM3-5N3W-FZRJ-GSZX9</a>
                                                </td>
                                                <td className={""}>
                                                    6/30/2018  23:18:09
                                                </td>
                                                <td className={""}>
                                                    3,989
                                                </td>
                                                <td className={"align-right"}>
                                                    <div className="btn-box inline">
                                                        <a className="btn primary blue">View</a>
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <div className="btn-box">
                                        <a className="btn btn-right blue" >View more</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account
});

const mapDispatchToProps = dispatch => ({
    getAliasesAction: (reqParams) => dispatch(getAliasesAction(reqParams))
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivePools);