import React from 'react';
import InputForm from '../../components/input-form';
import {getCurrencyAction} from "../../../actions/currencies";
import {connect} from 'react-redux';

class CurrencyInput extends React.Component {

    state = {}

    componentDidMount = () => {
        const {defaultValue} = this.props;
        if (defaultValue) {
            this.getCurrency({code: defaultValue});
        }
    }

    getCurrency = async (reqParams) => {
        const {setValue} = this.props;

        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency });
            setValue('decimals', result.decimals);
            setValue('currency', result.currency);

        } else {
            this.setState({ currency: '-' });
        }
    };

    render () {
        const {setValue, field, disabled} = this.props;

        return (
            <div className="form-group mb-15">
                <label>
                    Currency
                </label>
                <div className="input-group">
                    <InputForm
                        field={field}
                        placeholder="Code"
                        onChange={(code) => this.getCurrency({code})}
                        setValue={setValue}
                        disabled={disabled}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">ID: {this.state.currency}</span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getCurrencyAction: (requestParams) => dispatch(getCurrencyAction(requestParams)),
});

export default connect(null, mapDispatchToProps)(CurrencyInput)
