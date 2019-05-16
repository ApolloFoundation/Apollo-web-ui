import React from 'react';
import AccountRS from '../account-rs';

const AccountRSFormInput = (props) => {
    const {setValue, noContactList, exportAccountList, label, field, value, defaultValue, handleRemoveItem, index, idGroup} = props;

    return (
        <div className="form-group mb-15">
                <label>
                    {label}&nbsp;
                    <i className="zmdi zmdi-portable-wifi-changes" />
                </label>
                <div>
                    <div className="input-group iconned-input-field">
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
        </div>
    )
}

export default AccountRSFormInput;