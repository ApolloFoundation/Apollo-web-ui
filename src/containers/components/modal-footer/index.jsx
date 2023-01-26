import React from 'react';
import { connect } from 'react-redux';
import CustomInput from '../custom-input/CustomInputWithFormik';
import BlockHeightInput from '../form-components/BlockHeight/block-height-input1';
import InfoBox from '../info-box';

const mapStateToProps = state => ({
  is2fa: state.account.is2FA,
  accountControls: state.account.accountControls,
});

const ModalFooter = ({
  idGroup, accountControls, is2fa, off2FA,
}) => (
  <>
    <div className="form-group mb-15">
      <CustomInput
        name="secretPhrase"
        label="Secret phrase"
        type="password"
        placeholder="Secret Phrase"
        id={`${idGroup}secretPhrase-field`}
      />
    </div>
    {is2fa && !off2FA && (
      <div className="form-group mb-15">
        <CustomInput
          name="code2FA"
          label="2FA code"
          type="password"
          placeholder="2FA code"
          id={`${idGroup}code2FA-field`}
        />
      </div>
    )}
    {accountControls && (
      <>
        <InfoBox info>
          Mandatory Approval account control is enabled. Please set Finish Height.
          Account Control Details
        </InfoBox>
        <BlockHeightInput
          label="Finish Height"
          field="phasingFinishHeight"
          placeholder="Finish Height"
        />
      </>
    )}
  </>
);

export default connect(mapStateToProps)(ModalFooter);
