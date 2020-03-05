import React from 'react';
import {connect} from "react-redux";
import {ONE_APL} from '../../../../../constants';
import {getTransactionFee} from "../../../../../actions/wallet";
import {setTypeOfTrade, resetTrade} from "../../../../../modules/modals";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";
import {formatGweiToEth} from "../../../../../helpers/format";

class TradeApollo extends React.Component {
    feeATM = 200000000;
    state = {
        maxFee: null,
    };

    componentDidMount() {
        this.getTransactionFee();
        this.props.resetTrade();
    };

    getTransactionFee = async () => {
        const transactionFee = await this.props.getTransactionFee();
        if (transactionFee) {
            this.setState({maxFee: transactionFee.fast});
        }
    };

    changeTabOfTrade = typeOfTrade => {
        this.props.setTypeOfTrade(typeOfTrade);
        this.props.resetTrade();
    };

    render() {
        const {wallet, handleLoginModal, typeOfTrade} = this.props;
        const ethMinTxFee = 0.002;
        return (
            <div className={'card card-light h-400'}>
                <div className="card-title">
                    <div className={'title'}>Trade Apollo</div>
                    <span className={'sub-title'}>Fee: {this.feeATM / ONE_APL} APL</span>
                </div>
                <div className="card-body">
                    <div className={'tabs-wrap mb-3'}>
                        <div
                            className={`tab-item ${typeOfTrade === 'BUY' ? 'active' : ''}`}
                            onClick={() => this.changeTabOfTrade('BUY')}
                        >
                            Buy APL
                        </div>
                        <div
                            className={`tab-item ${typeOfTrade === 'SELL' ? 'active' : ''}`}
                            onClick={() => this.changeTabOfTrade('SELL')}
                        >
                            Sell APL
                        </div>
                    </div>
                    {typeOfTrade === 'BUY' ? (
                        <BuyForm
                            wallet={wallet}
                            handleLoginModal={handleLoginModal}
                            ethFee={ethMinTxFee}
                        />
                    ) : (
                        <SellForm
                            wallet={wallet}
                            handleLoginModal={handleLoginModal}
                            ethFee={ethMinTxFee}
                        />
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    typeOfTrade: state.modals.typeOfTrade,
});

const mapDispatchToProps = dispatch => ({
    resetTrade: () => dispatch(resetTrade()),
    getTransactionFee: () => dispatch(getTransactionFee()),
    setTypeOfTrade: (params) => dispatch(setTypeOfTrade(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeApollo);