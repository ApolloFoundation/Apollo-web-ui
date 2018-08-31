import React from 'react';
import Select from 'react-select';

import './Select.css'

class CustomSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <Select
                className={'custom-select'}
                options={this.props.options}
                onChange={(selectedOption) => {this.props.setValue(this.props.field, selectedOption.value)}}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        text: 'orangered',
                        primary25: 'hotpink',
                        primary: 'black',
                    },
                })}
            />
        );
    }
}

export default CustomSelect;