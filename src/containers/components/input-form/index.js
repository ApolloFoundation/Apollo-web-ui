/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {Text} from 'react-form';


class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || ''
        };
        if (props.setValue && props.field) {
            props.setValue(props.field, props.defaultValue || '');
        }
    };

    handleChange = (value) => {
        const {setValue, field} = this.props;
        if (setValue && field) {
            setValue(field, this.validateInput(value));
        }
    };

    validateInput = (value) => {
        const {type, isSpecialSymbols, id} = this.props;

        if (!value.target) {
            if (type === "password" || isSpecialSymbols) {
                if (this.props.onChange) this.props.onChange(value);
                this.setState({value});
                
                return value;
            } 
            if (type === "tel") {
                value = value.replace(/[^\d]/g, "");
                if (/^0+/.test(value)) {
                    value = value.replace(/0+/, "");
                }

                if (this.props.maxValue !== undefined && parseFloat(value) > parseFloat(this.props.maxValue)) {
                    value = this.props.maxValue;
                }
                if (this.props.minValue !== undefined && parseFloat(value) < parseFloat(this.props.minValue)) {
                    value = this.props.minValue;
                }
            }
            if (type === "float") {
                value = value.replace(",", ".");
                if (value === '.') value = '0.';
                value = value.replace(/[^\d.]|\.(?=.*\.)/g, "");
                if (value.indexOf('.') !== 1)
                    if (value.length !== 1)
                        if (value.indexOf("0.") === 0)
                            value = value.replace("0.", "");
                if (value.indexOf('.') === 0)
                    value = value.replace(".", "0.");
                if (/^0[0-9]/.test(value)) {
                    value = value.replace(/0+/, "");
                }
                if (value.includes(".")) {
                    let fract = value.substring(value.indexOf("."));
                    value = value.substring(0, value.indexOf("."));
                    if (fract.length > 10) {
                        fract = fract.substring(0, 10);
                    }
                    value += fract;
                }
                if (this.props.maxValue !== undefined && parseFloat(value) > parseFloat(this.props.maxValue)) {
                    value = this.props.maxValue;
                }
                if (this.props.minValue !== undefined && parseFloat(value) < parseFloat(this.props.minValue)) {
                    value = this.props.minValue;
                }
            } 
            if (type !== "password" && type !== "tel" && type !== "float" && !isSpecialSymbols) {
                value = value.replace(/[;`'"%!#&~<>@_=*+?^${}|[\]\\]/g, "");
            }
        } else {
            value = value.target.value;
            if (type === "password" || isSpecialSymbols) {
                if (this.props.onChange) this.props.onChange(value);
                this.setState({value});
                return value;
            } 
            if (type === "tel") {
                value = value.replace(/[^\d]/g, "");
            } 
            if (type === "float") {
                value = value.replace(",", ".");
                if (value === '.') value = '0.';
                value = value.replace(/[^\d.]|\.(?=.*\.)/g, "");
            } 
            if (type === "password" && type === "tel" && type === "float" && !isSpecialSymbols) {
                value = value.replace(/[;`'"%!#&~<>@_=*+?^${}|[\]\\]/g, "");
            }
        }
        if (this.props.onChange) this.props.onChange(value);
        this.setState({value});
        return value;
    };

    handleClickUp = () => {
        if (!this.props.disabled) {
            let value = this.state.value !== '' ? parseFloat(this.state.value) : 0;

            const step = this.props.step || 1;
            value = value + step;

            if (this.props.maxValue !== undefined && value > parseFloat(this.props.maxValue)) {
                value = this.props.maxValue;
            }
            if (this.props.setValue && this.props.field) {
                this.props.setValue(this.props.field, value);
            }
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

                if (this.props.minValue !== undefined && value < parseFloat(this.props.minValue)) {
                    value = this.props.minValue;
                }
                if (this.props.setValue && this.props.field) {
                    this.props.setValue(this.props.field, value);
                }
                this.setState({value});
                if (this.props.onChange) this.props.onChange(value);
            }
        }
    };

    render() {
        return (
            <div className="input-text-wrap">
                <Text
                    value={this.state.value}
                    className={`form-control ${this.props.className}`}
                    field={this.props.field}
                    defaultValue={this.props.defaultValue}
                    placeholder={this.props.placeholder}
                    minLength={this.props.minLength}
                    disabled={this.props.disabled}
                    type={this.props.type}
                    id={this.props.id}

                    onKeyUp={this.handleChange}
                    onMouseUp={this.handleChange}
                    onMouseDown={this.handleChange}
                    onChange={this.handleChange}
                    onBlur={this.props.onBlur ? this.props.onBlur : () => {
                    }}

                />
                {(this.props.type === "tel" || this.props.type === "float") && !this.props.disabled && (
                    <div className="input-number-wrap">
                        <div className="input-number-up" onClick={this.handleClickUp}/>
                        <div className="input-number-down" onClick={this.handleClickDown}/>
                    </div>
                )}
            </div>
        );
    }
}

export default InputForm;