import React from 'react';
import {connect} from "react-redux";
import {ONE_APL} from '../../../../../constants';
import {getTransactionFee} from "../../../../../actions/wallet";
import {setTypeOfTrade} from "../../../../../modules/modals";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

class TradeApollo extends React.Component {
    feeATM = 200000000;
    state = {
        maxFee: null,
    };

    componentDidMount() {
        this.getTransactionFee();
    };

    getTransactionFee = async () => {
        const transactionFee = await this.props.getTransactionFee();
        if (transactionFee) {
            this.setState({maxFee: transactionFee.fast});
        }
    };

    render() {
        const {wallet, handleLoginModal, currentCurrency: {currency}, constants, gasTransactionMultiply, typeOfTrade} = this.props;
        const gasLimit = currency === 'eth' ? constants.gasLimitEth : constants.gasLimitERC20;
        const ethFee = this.state.maxFee * gasLimit * 0.000000001;
        const gasFee = this.state.maxFee * gasTransactionMultiply * 0.000000001;
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
                            onClick={() => this.props.setTypeOfTrade('BUY')}
                        >
                            Buy APL
                        </div>
                        <div
                            className={`tab-item ${typeOfTrade === 'SELL' ? 'active' : ''}`}
                            onClick={() => this.props.setTypeOfTrade('SELL')}
                        >
                            Sell APL
                        </div>
                    </div>
                    {typeOfTrade === 'BUY' ? (
                        <BuyForm
                            wallet={wallet}
                            handleLoginModal={handleLoginModal}
                            ethFee={ethFee}
                            gasFee={gasFee}
                        />
                    ) : (
                        <SellForm
                            wallet={wallet}
                            handleLoginModal={handleLoginModal}
                            gasFee={gasFee}
                            ethFee={ethFee}
                        />
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    constants: state.account.constants,
    gasTransactionMultiply: state.account.gasTransactionMultiply,
    typeOfTrade: state.modals.typeOfTrade,
});

const mapDispatchToProps = dispatch => ({
    getTransactionFee: () => dispatch(getTransactionFee()),
    setTypeOfTrade: (params) => dispatch(setTypeOfTrade(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeApollo);