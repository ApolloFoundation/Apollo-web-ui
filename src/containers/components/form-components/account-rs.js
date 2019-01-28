import React from 'react';
import AccountRS from '../account-rs';

const AccountRSFormInput = (props) => {
    const {setValue, exportAccountList, label, field, value, defaultValue} = props;

    return (
        <div className="input-group-app form-group mb-15 display-block inline user">
            <div className="row form-group-grey">
                <label className="col-sm-3 col-form-label">
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
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountRSFormInput;