/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {openPrevModal, setBodyModalParamsAction} from '../../../modules/modals';
import Transaction from '../../account/transactions/transaction';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import {getAccountAssetsAction, getSpecificAccountAssetsAction} from "../../../actions/assets";

class AssetDistribution extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assets: null
        };
    }

    componentDidUpdate = () => {
        if (this.props.account && !this.state.assets) {
            this.getAccountAssets();
        }
    }

    componentDidMount() {
        this.getAccountAssets();
    }


    getAccountAssets = async (modalType, transactionId) => {
        const assets = await this.props.getAccountAssetsAction({
            requestType: 'getAssetAccounts',
            asset: this.props.modalData.asset
        });

        if (assets) {
            this.setState({
                assets: assets.accountAssets
            })
        }
    };

    // TODO: migrate timesamp, migrate account to RS

    render() {
        return (
            <div className="modal-box">
                <div className="modal-form">
                    <div className="form-group-app">
                        <button type="button" onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close"/></button>

                        <div className="form-title">
                            <p>Asset Distribution</p>
                        </div>

                        <div className="transaction-table no-min-height">
                            <div className="transaction-table-body transparent padding-vertical-padding">

                                <table>
                                    <thead>
                                    <tr>
                                        <td>Account</td>
                                        <td>Quantity</td>
                                        <td className="align-right">Percentage</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.assets &&
                                        this.state.assets.length &&
                                        this.state.assets.map((el, index) => {

                                            return (
                                                <tr>
                                                    <td
                                                        className={'blue-link-text'}
                                                    >
                                                        <a
                                                            className={'blue-link-text'}
                                                            onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', el.account)}>
                                                            {el.accountRS}
                                                        </a>
                                                    </td>

                                                    <td>{el.quantityATU / Math.pow(10, this.props.modalData.decimals)}</td>
                                                    <td className="align-right">{(el.quantityATU / this.props.modalData.totalAvailable) * 100} %</td>
                                                </tr>
                                            )
                                        })
                                    }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory
});

const mapDispatchToProps = dispatch => ({
    getAccountAssetsAction: (requestParams) => dispatch(getAccountAssetsAction(requestParams)),
    getAccountAssetAction: (reqParams) => dispatch(getSpecificAccountAssetsAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),

    openPrevModal: (Params) => dispatch(openPrevModal(Params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetDistribution);
