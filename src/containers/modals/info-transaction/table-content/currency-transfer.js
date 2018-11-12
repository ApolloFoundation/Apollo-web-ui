import React, {Component} from "react";
import {connect} from 'react-redux';
import {getCurrencyAction} from "../../../../actions/currencies";
import {formatTimestamp} from "../../../../helpers/util/time";


class CurrencyTransfer extends Component {

    componentDidMount = () => {
        this.getCurrency();
    };

    state = {};

    getCurrency = async () => {
        const currency = await this.props.getCurrencyAction({currency: this.props.transaction.attachment.currency});

        if (currency) {
            this.setState({
                ...this.state,
                currency
            });
        }
    };

    render() {


        return(
            <React.Fragment>

                {
                    this.state.currency &&
                    this.state.currency.code &&
                    <tr>
                        <td>Code:</td>
                        <td>{this.state.currency.code}</td>
                    </tr>
                }
                {
                    this.state.currency &&
                    this.props.transaction &&
                    <tr>
                        <td>Units:</td>
                        <td>{this.props.transaction.attachment.units / Math.pow(10, this.state.currency.decimals)}</td>
                    </tr>
                }


            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    constants: state.account.constants,
});

const mapDispatchToProps = dispatch => ({
    getCurrencyAction: (reqParams) => dispatch(getCurrencyAction(reqParams)),
});


export default connect(mapStateToProps, mapDispatchToProps)(CurrencyTransfer)