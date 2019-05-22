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
        const {setValue, field} = this.props;

        const result = await this.props.getCurrencyAction(reqParams);

        if (result) {
            this.setState({ currency: result.currency });
            setValue(field, result.currency);
            setValue('decimals', result.decimals);

        } else {
            this.setState({ currency: '-' });
        }
    };

    render () {
        const {setValue, field, disabled} = this.props;

        return (
            <div className="form-group row form-group-grey mb-15">
                <label className="col-sm-3 col-form-label">
                    Currency
                </label>
                <div className="col-sm-9 input-group input-group-double input-group-text-transparent input-group-sm mb-0">
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
