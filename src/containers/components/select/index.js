import React from 'react';
import Select from 'react-select';

const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: ' ',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white'}),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: '#fff',
            color: '#000',
            cursor: isDisabled ? 'not-allowed' : 'default',
            width: '100%'
        };
    },
    input: styles => ({ ...styles, width: '100%',}),
    placeholder: styles => ({ }),
    singleValue: (styles, { data }) => ({ ...styles, width: '100%'}),
};

class CustomSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <Select
                styles={colourStyles}
                options={this.props.options}
            />
        );
    }
}

export default CustomSelect;