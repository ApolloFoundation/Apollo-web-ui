import React from 'react';
import AccountRS from '../../account-rs';

const AccountRSFormInput = props => {
  const {
    noContactList, exportAccountList, label, idGroup,
    name, handleRemoveItem, index,
  } = props;

  return (
    <div className="form-group mb-15">
      <label>
        {label}
      </label>
      <div>
        <div className="input-group iconned-input-field">
          <AccountRS
            name={name}
            exportAccountList={exportAccountList}
            noContactList={noContactList}
            id={`${idGroup}${name}-field`}
          />
          {
            handleRemoveItem
            && (
            <div
              className="input-icon remove-item"
              onClick={() => handleRemoveItem(index)}
            >
              <span className="input-group-text">
                <i className="zmdi zmdi-minus-circle" />
              </span>
            </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AccountRSFormInput;
