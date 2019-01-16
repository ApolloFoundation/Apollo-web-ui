import React from 'react';
import AccountRS from '../account-rs'

const AccountInptSection = (setValue, defaultValue, label, field, placeholder) => (
    <div className="input-group-app form-group mb-15 display-block inline user">
        <div className="row form-group-white">
            <label htmlFor="recipient" className="col-sm-3 col-form-label">
                Recipient <i className="zmdi zmdi-portable-wifi-changes"/>
            </label>
            <div className="col-sm-9">
                <div className="iconned-input-field">
                    <AccountRS
                        field={field}
                        defaultValue={(this.props.modalData && this.props.modalData.recipient) ? this.props.modalData.recipient : ''}
                        setValue={setValue}
                        placeholder={'Account ID'}
                    />
                </div>
            </div>
        </div>
    </div>
)