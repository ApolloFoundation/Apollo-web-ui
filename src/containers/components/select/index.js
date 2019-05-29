/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import Select from 'react-select';

import './Select.scss'

class CustomSelect extends React.Component {
    state = {
        value: null,
        defaultValue: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.defaultValue !== state.defaultValue) {
            if (props.defaultValue) props.setValue(props.field, props.defaultValue.value);
            return {
                defaultValue: props.defaultValue,
                value: props.defaultValue,
            };
        }

        return null;
    }

    customStyles = {
        option: (styles, {data, isDisabled, isFocused, isSelected}) => {
            return {
                ...styles,
                backgroundColor: isDisabled
                    ? null
                    : isSelected ? '#eee' : '#fff',
                color: '#515151',
                padding: 10,
                cursor: isDisabled ? 'not-allowed' : 'default',
            };
        },
    };

    render() {
        return (
            <Select
                styles={this.customStyles}
                className={'form-custom-select'}
                classNamePrefix={'custom-select-box'}
                options={this.props.options}
                value={this.state.value}
                defaultValue={this.props.defaultValue}
                onChange={(selectedOption) => {
                    this.setState({value: selectedOption});
                    if (this.props.setValue) this.props.setValue(this.props.field, selectedOption.value);
                    if (this.props.onChange) this.props.onChange(selectedOption.value);
                    if (this.props.handler) this.props.handler(selectedOption);
                }
                }
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        primary: 'black',
                    },
                })}
            />
        );
    }
}

export default CustomSelect;