/** ****************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import InputForm from '../../components/input-form';
import AccountRSFormInput from '../../components/form-components/account-rs';

const SetAccountPropertyForm = ({ setValue, modalData, values }) => (
  <>
    {(modalData && modalData.recipientRS) ? (
      <div className="form-group mb-15">
        <label>
          Recipient
        </label>
        <div>
          <span>{modalData.recipientRS}</span>
        </div>
      </div>
    ) : (
      <AccountRSFormInput
        field="recipient"
        label="Recipient"
        setValue={setValue}
        defaultValue={values.recipient ?? ''}
        value={values.recipient}
      />
    )}
    <div className="form-group mb-15">
      <label>
        Property
      </label>
      <div>
        {(modalData && modalData.property) ? (
          <span>{modalData.property}</span>
        ) : (
          <InputForm
            field="property"
            placeholder="Property"
            setValue={setValue}
          />
        )}
      </div>
    </div>
    <div className="form-group mb-15">
      <label>
        Value
      </label>
      <div>
        <InputForm
          field="value"
          defaultValue={(modalData && modalData.value) ? modalData.value : ''}
          placeholder="Value"
          setValue={setValue}
        />
      </div>
    </div>
  </>
);

const mapStateToProps = state => ({ modalData: state.modals.modalData });

export default connect(mapStateToProps)(SetAccountPropertyForm);
