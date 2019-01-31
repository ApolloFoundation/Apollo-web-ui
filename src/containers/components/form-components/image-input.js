import React from 'react';
import {NotificationManager} from 'react-notifications';

class ImageInput extends React.Component {

    state = {};

    handleFileOnChange = (e, setValue) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
            };

            setValue("messageIsText", false);
            setValue("messageIsPrunable", true);

            if(file) reader.readAsDataURL(file);
        } else {
            NotificationManager.error('You`r chosen image file is not allowed for uploading. Use only jpeg.', null, 5000)
            document.getElementById("file").value = "";
            this.setState({
                file: null,
                imagePreviewUrl: null
            });
        }
    }

    render () {
        const {setValue} = this.props;

        return (
            <>
                <div className="form-group row form-group-white mb-15">
                    <label className="col-sm-3 col-form-label">
                        Image
                    </label>
                    <div className="col-sm-9">
                        <div className="iconned-input-field">
                            <div className="input-group-app search">
                                <div
                                    style={{height: 33}}
                                    className="iconned-input-field"
                                >
                                    <div className="input-icon text"><i className="">Browse&hellip;</i></div>
                                    <input
                                        id="file"
                                        type="file"
                                        placeholder="Recipient"
                                        onChange={(e) => this.handleFileOnChange(e, setValue)}
                                    />
                                    <div className={'input-file-area'}>
                                        <div className="input-file-name">
                                            {
                                                this.state.file &&
                                                this.state.file.name ?
                                                    this.state.file.name :
                                                    <span className={"no-file-selected"}>No file selected</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="form-sub-title block align-right align-margin-top">
                            Max file size - 40 KB
                        </div>
                    </div>
                </div>
                <div className="form-group row form-group-white mb-15">
                    <div className="col-sm-9 offset-sm-3">
                        {
                            !this.state.imagePreviewUrl &&
                            <>
                                <div className="no-image">
                                    <i className="zmdi zmdi-image" />
                                </div>
                                <div className="preview-image-container">
                                    <div className="preview-image" style={{backgroundImage: `url(${this.state.imagePreviewUrl})`}}/>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default ImageInput;