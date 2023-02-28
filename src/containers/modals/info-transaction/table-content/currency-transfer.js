import React, {Component} from "react";
import {connect} from 'react-redux';
import { getConstantsSelector } from "selectors";
import {getCurrencyAction} from "actions/currencies";
import { bigIntDecimalsDivision, bigIntFormat } from "helpers/util/bigNumberWrappers";

class CurrencyTransfer extends Component {

    componentDidMount = () => {
        this.getCurrency();
    };

    state = {};

    getCurrency = async () => {
        const currency = await this.props.getCurrencyAction({currency: this.props.transaction.attachment.currency});

        if (currency) {
            this.setState({
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
                        <td>{bigIntFormat(bigIntDecimalsDivision(this.props.transaction.attachment.units, this.state.currency.decimals))}</td>
                    </tr>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    constants: getConstantsSelector(state),
});

const mapDispatchToProps = {
    getCurrencyAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyTransfer)