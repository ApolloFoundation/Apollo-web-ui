import { useFormikContext } from 'formik';
import React, { useCallback, useState } from 'react';
import InputUpload from "containers/components/input-upload";

const FileInput = ({ label, type, accept, maxSize, showPreview, name, hidenMaxSize }) => {
    const [fileData, setFileData] = useState(null);

    const formik = useFormikContext();

    const handleFileAccepted = useCallback((files) => {
        const [file] = files;
        if (showPreview) {
            switch (file.type) {
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/png':
                    file.preview = URL.createObjectURL(file);
                    break;
                default:
                    break;
            }
        }
        if (formik.setFieldValue) {
            formik.setFieldValue("messageIsText", false);
            formik.setFieldValue("messageIsPrunable", true);
            formik.setFieldValue(name, file);
        }
        setFileData(file);
    }, [showPreview, formik.setFieldValue, name]);

    const handleFileRejected = useCallback(() => {
        formik.setFieldValue(name, null);
        setFileData(null);
    }, [name, formik.setFieldValue]);

    return (
        <div className="form-group mb-15">
            <label>
                {label}
            </label>
            <div>
                <InputUpload
                    id="file"
                    type={type}
                    accept={accept}
                    maxSize={maxSize}
                    handleFileAccepted={handleFileAccepted}
                    handleFileRejected={handleFileRejected}
                />
                {maxSize && !hidenMaxSize && (
                    <div className="form-sub-title block align-right align-margin-top">
                        Max file size - {maxSize / 1000} KB
                    </div>
                )}
            </div>
            {showPreview && fileData && fileData.preview && (
                <div className="preview-image-container">
                    <div className="preview-image" style={{backgroundImage: `url(${fileData.preview})`}}/>
                </div>
            )}
        </div>
    )
}

export default FileInput;

