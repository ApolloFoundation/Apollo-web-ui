import React from "react";
import AccountRS from "../account-rs/index1";

const AccountRSFormInput = (props) => {
  const {
    noContactList,
    exportAccountList,
    label,
    idGroup,
    name,
    handleRemoveItem,
    placeholder,
    index,
    disabled,
  } = props;

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className={!noContactList && 'input-group iconned-input-field'}>
        <AccountRS
          name={name}
          exportAccountList={exportAccountList}
          noContactList={noContactList}
          id={`${idGroup}${name}-field`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {handleRemoveItem && (
          <div
            className="input-icon remove-item"
            onClick={() => handleRemoveItem(index)}
          >
            <span className="input-group-text">
              <i className="zmdi zmdi-minus-circle" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountRSFormInput;
