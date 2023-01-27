import React, { useCallback, useState } from 'react';
import QRCode from 'qrcode.react';
import { useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import InfoBox from 'containers/components/info-box'
import ModalBody from 'containers/components/modals/modal-body';
import { getAccountSelector } from 'selectors';

export const GenerateToken = ({ closeModal, processForm }) => {
  const account = useSelector(getAccountSelector);
  const [generatedToken, setGeneratedToken] = useState(null)

  const handleFormSubmit = useCallback(async (values) => {
    if (!values.data || values.data.length === 0) {
        NotificationManager.error('Data is required.', 'Error', 5000);
        return;
    }
    if (!values.secretPhrase || values.secretPhrase.length === 0) {
        NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
        return;
    }

    const res = await processForm({
        requestType: 'generateToken',
        secretPhrase: values.secretPhrase,
        website: values.data,
        account,
    }, 'generateToken');

    if (!res.errorCode) {
        setGeneratedToken(res.token);
    }
  }, [processForm]);
  
  return (
    <ModalBody
        closeModal={closeModal}
        handleFormSubmit={handleFormSubmit}
        className='p-0 transparent gray-form'
        isDisabe2FA
        isPour
        submitButtonName='Generate'
    >
        <CustomTextArea
          label='Data'
          name='data'
          placeholder='Website or text'
        />
        {generatedToken && (
            <>
                <p style={{ marginBottom: 18 }}>The generated token is:</p>
                <InfoBox info>
                    <div className="token word-brake">{generatedToken}</div>
                </InfoBox>
                <div className="qr-code-image">
                    <QRCode value={generatedToken} size={100} />
                </div>
            </>
        )}
    </ModalBody>
  );
}