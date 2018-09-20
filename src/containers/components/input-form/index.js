import React from 'react';
import {Text} from 'react-form';


class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue || ''
        };
        this.props.setValue(this.props.field, this.props.defaultValue || '');
    };

    handleChange = (value) => {
        if (this.props.onChange) this.props.onChange(value);
        this.props.setValue(this.props.field, this.validateInput(value));
    };

    validateInput = (value) => {
        if (this.props.type === "number") {
            value = value.replace(/[^\d]/g,"");
        } else if (this.props.type === "float") {
            value = value.replace(",", ".");
            if (value === '.') value = '0.';
            value = value.replace(/[^\d.]|\.(?=.*\.)/g, "");
        } else {
            value = value.replace(/[,;:`'"%!#&~<>@_=*+?^${}|[\]\\]/g, "");
        }
        this.setState({ value });
        return value;
    };

    handleClickUp = () => {
        if (!this.props.disabled) {
            let value = this.state.value !== '' ? parseFloat(this.state.value) : 0;
            const step = this.props.step || 1;
            value = value + step;
            this.props.setValue(this.props.field, value);
            this.setState({value});
            if (this.props.onChange) this.props.onChange(value);
        }
    };

    handleClickDown = () => {
        if (!this.props.disabled) {
            let value = this.state.value !== '' ? parseFloat(this.state.value) : 0;
            if (value > 0) {
                const step = this.props.step || 1;
                value = value - step;
                if (value < 0) value = 0;
                this.props.setValue(this.props.field, value);
                this.setState({value});
                if (this.props.onChange) this.props.onChange(value);
            }
        }
    };

    render() {
        return (
            <div className="input-text-wrap">
                <Text
                    onChange={this.handleChange}
                    value={this.state.value}
                    className={`form-control ${this.props.className}`}
                    field={this.props.field}
                    defaultValue={this.props.defaultValue}
                    placeholder={this.props.placeholder}
                    minLength={this.props.minLength}
                    disabled={this.props.disabled}
                />
                {(this.props.type === "number" || this.props.type === "float") &&
                <div className="input-number-wrap">
                    <div className="input-number-up" onClick={this.handleClickUp}/>
                    <div className="input-number-down" onClick={this.handleClickDown}/>
                </div>
                }
            </div>
        );
    }
}

export default InputForm;