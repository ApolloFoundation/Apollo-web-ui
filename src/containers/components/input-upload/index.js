import React from 'react';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import UploadImg from '../../../assets/upload-icon.png';

const InputUpload = ({id}) => {
    const handleDrop = (acceptedFiles) => {
        $(`#${id}`).prop('files', acceptedFiles);
    };

    return (
        <Dropzone
            onDrop={handleDrop}
            multiple={false}
        >
            {({getRootProps, getInputProps, acceptedFiles}) => (
                <div {...getRootProps()} className={'upload-block'}>
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
