import React from 'react';
import InputMask from 'react-input-mask';
import {Text} from 'react-form'


class MaskedInput extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        value: '',
        mask: 'APL-****-****-****-*****',
        alwaysShowMask: true
    };

    handleChange = (event) => {
        if (event.target) {
            var value = event.target.value;
            var newState = {
                mask: 'APL-****-****-****-*****',
                value: value.toUpperCase()
            };

            if (/^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(value)) {
                newState.value = 'APL-****-****-****-*****';
            }
            this.setState(newState);
        }
    };

    render() {
        return (
            <InputMask {...this.state} onChange={this.handleChange}>
                { (inputProps) => <Text {...inputProps} field="recipient" placeholder="Recipient"/>}
            </InputMask>
        );
    }
}

export default MaskedInput;