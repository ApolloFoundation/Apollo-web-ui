/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import Select from 'react-select';

import './Select.css'

class CustomSelect extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.defaultValue) this.props.setValue(this.props.field, this.props.defaultValue.value);
    }

    customStyles = {
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isDisabled
                    ? null
                    : isSelected ? '#eee' : '#fff' ,
                color: '#515151',
                padding: 10,
                cursor: isDisabled ? 'not-allowed' : 'default',
            };
        },
    };

    render () {
        return (
            <Select
                styles={this.customStyles}
                className={'form-custom-select'}
                classNamePrefix={'custom-select-box'}
                options={this.props.options}
                defaultValue={this.props.defaultValue}
                onChange={(selectedOption) => {
                        this.props.setValue(this.props.field, selectedOption.value);
                        if (this.props.onChange) {
                            this.props.onChange(selectedOption.value);
                        }
                        if (this.props.handler) {
                            this.props.handler(selectedOption)
                        }
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