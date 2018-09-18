import React from 'react';
import uuid from 'uuid';
import {setBodyModalParamsAction, setMopalType} from "../../../../modules/modals";
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

class MyAssetItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transfer: this.props.transfer
        }
    }

    componentWillReceiveProps (newState) {
        this.setState({
            transfer: newState.transfer
        })
    }

    render () {
        if (this.state.transfer) {
            return (
                <tr key={uuid()}>
                    <td className="blue-link-text">
                        <Link to={"/asset-exchange/" + this.state.transfer.asset}>{this.state.transfer.name}</Link>
                    </td>
                    <td className="align-right">
                        {(this.state.transfer.quantityATU / Math.pow(10, this.state.transfer.decimals)).toFixed(2)}
                    </td>
                    <td className="align-right">{(this.state.transfer.initialQuantityATU  / Math.pow(10, this.state.transfer.decimals)).toFixed(2)}</td>
                    <td className="align-right">
                        {((parseInt(this.state.transfer.quantityATU) / parseInt(this.state.transfer.initialQuantityATU)) * 100).toFixed(2)}&nbsp;%
                    </td>
                    {
                        !this.props.info &&
                        <React.Fragment>
                            <td className="align-right"></td>
                            <td className="align-right" ></td>
                            <td className="align-right blue-link-text">
                            </td>
                            <td className="align-right">
                                <div className="btn-box inline">
                                    <a
                                        onClick={() => this.props.setBodyModalParamsAction('TRANSFER_ASSET', {
                                            quantityATU: this.state.transfer.quantityATU,
                                            assetID:   this.state.transfer.asset,
                                            assetName: this.state.transfer.name
                                        })}
                                        className="btn primary blue"
                                    >
                                        Transfer
                                    </a>
                                    <a
                                        onClick={() => this.props.setBodyModalParamsAction('DELETE_SHARES', {
                                            quantityATU: this.state.transfer.quantityATU,
                                            assetID:   this.state.transfer.asset,
                                            assetName: this.state.transfer.name
                                        })}
                                        className="btn primary blue"
                                    >
                                        Delete Shares
                                    </a>
                                </div>
                            </td>
                        </React.Fragment>
                    }
                </tr>
            );
        } else {
            return (
                <tr key={uuid()}></tr>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    setMopalType: (type) => dispatch(setMopalType(type))
});

export default connect(null, mapDispatchToProps)(MyAssetItem);