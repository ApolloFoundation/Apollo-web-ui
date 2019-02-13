import React from 'react';
import AccountRS from '../account-rs';

const AccountRSFormInput = (props) => {
    const {setValue, noContactList, exportAccountList, label, field, value, defaultValue, handleRemoveItem, index, idGroup} = props;

    return (
        <div className="input-group-app form-group mb-15 display-block inline user">
            <div className="row form-group-grey">
                <label className="col-sm-3 col-form-label white-space">
                    {label}
                    <i class="zmdi zmdi-portable-wifi-changes" />
                </label>
                <div className="col-sm-9">
                    <div className="iconned-input-field">
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
        </div>
    )
}

export default AccountRSFormInput;