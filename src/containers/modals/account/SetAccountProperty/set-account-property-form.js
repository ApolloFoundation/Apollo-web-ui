/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import AccountRSFormInput from '../../../components/form-components/AccountRS';
import CustomInput from '../../../components/custom-input/CustomInputWithFormik';

const SetAccountPropertyForm = ({ recipientRS, property }) => (
  <>
    {(recipientRS) ? (
      <div className="form-group mb-15">
        <label>
          Recipient
        </label>
        <div>
          <span>{recipientRS}</span>
        </div>
      </div>
    ) : (
      <AccountRSFormInput
        name="recipient"
        label="Recipient"
      />
    )}
    <div className="form-group mb-15">
      <label>
        Property
      </label>
      <div>
        {(property) ? (
          <span>{property}</span>
        ) : (
          <CustomInput
            name="property"
            placeholder="Property"
          />
        )}
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Value
      </label>
      <div>
        <CustomInput
          name="value"
          placeholder="Value"
        />
      </div>
    </div>
  </>
);


export default SetAccountPropertyForm;
