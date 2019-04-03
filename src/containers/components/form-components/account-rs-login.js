import React from 'react';
import AccountRS from '../account-rs';

const AccountRSFormInputLogin = (props) => {
    const {setValue, noContactList, exportAccountList, label, field, value, defaultValue, handleRemoveItem, index, idGroup} = props;

    return (
        <div className="input-group-app user">
            <label>
                {label}
            </label>
            <div className="iconned-input-field pl-sm-0">
                <AccountRS
                    value={value}
                    field={field}
                    setValue={setValue}
                    defaultValue={defaultValue}
                    exportAccountList={exportAccountList}
                    noContactList={noContactList}
                    id={`${idGroup}${field}-field`}
                />
                {
                    handleRemoveItem &&
                    <div
                        className="input-icon remove-item"
                        onClick={() => handleRemoveItem(index)}
                    >
                                <span className="input-group-text">
                                    <i className="zmdi zmdi-minus-circle" />
                                </span>
                    </div>
                }
            </div>
        </div>
    )
};

export default AccountRSFormInputLogin;