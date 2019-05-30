import React from 'react';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import UploadImg from '../../../assets/upload-icon.png';
import {NotificationManager} from "react-notifications";

const InputUpload = ({id, maxSize, type, handleFileAccepted, handleFileRejected}) => {
    const onDropAccepted = (files) => {
        $(`#${id}`).prop('files', files);
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
                <div {...getRootProps()} className={`upload-block ${isDragActive ? 'upload-block-active' : ''}`}>
                    <input {...getInputProps()} />
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
