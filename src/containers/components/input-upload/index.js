import React from 'react';
import classNames from 'classnames';
import {NotificationManager} from "react-notifications";
import Dropzone from 'react-dropzone';
import UploadImg from '../../../assets/upload-icon.png';

const InputUpload = ({id, maxSize, type, accept, handleFileAccepted, handleFileRejected}) => {
    const onDropAccepted = (files) => {
        if (handleFileAccepted) handleFileAccepted(files);
    };
    const onDropRejected = () => {
        NotificationManager.error('Please select another file.', 'Error', 5000);
        if (handleFileRejected) handleFileRejected();
    };

    return (
        <Dropzone
            onDropAccepted={onDropAccepted}
            onDropRejected={onDropRejected}
            multiple={false}
            maxSize={maxSize}
            accept={type}
        >
            {({getRootProps, getInputProps, acceptedFiles, isDragActive}) => (
                <div {...getRootProps()} className={classNames('upload-block', { 'upload-block-active': isDragActive})}>
                    <input {...getInputProps()} accept={accept} />
                    <div className={'d-none'} id={id}/>
                    <p>
                        {acceptedFiles.length > 0 ?
                            acceptedFiles.map(acceptedFile => (
                                acceptedFile.name
                            )) : (
                                'Click or drag file to upload'
                            )
                        }
                    </p>
                    <img src={UploadImg} alt={''}/>
                </div>
            )}
        </Dropzone>
    )
};

export default InputUpload;
