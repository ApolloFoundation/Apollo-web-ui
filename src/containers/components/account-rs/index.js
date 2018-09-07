import React from 'react';
import InputMask from 'react-input-mask';


const AccountRS = (props) => (
    <InputMask mask='APL-****-****-****-*****' placeholder={'Account RS'} value={props.defaultValue} onChange={(e) => {
        if (e.target) {
            var value = e.target.value;
            var newState = {
                mask: 'APL-****-****-****-*****',
                value: value.toUpperCase()
            };

            if (/^APL-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}/.test(value)) {
                newState.value = 'APL-****-****-****-*****';
            }
            if (/^APL-/.test(e.target.value)) {
            }
            props.setValue(props.field, value);
        }
    }}
    >
    </InputMask>
);

export default AccountRS;