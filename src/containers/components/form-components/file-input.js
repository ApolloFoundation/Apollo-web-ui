import React from 'react';
import InputUpload from "../input-upload";

class FileInput extends React.Component {
    state = {
        file: null,
    };

    handleFileAccepted = (files) => {
        const [file] = files;
        if (this.props.showPreview) {
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
        if (this.props.setValue) {
            this.props.setValue("messageIsText", false);
            this.props.setValue("messageIsPrunable", true);
        }
        this.setState({file: file});
    };

    handleFileRejected = () => {
        this.setState({file: null});
    };

    render () {
        const {label, type, accept, maxSize, showPreview} = this.props;

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
                        file={this.state.file}
                        handleFileAccepted={this.handleFileAccepted}
                        handleFileRejected={this.handleFileRejected}
                    />
                    {maxSize && (
                        <div className="form-sub-title block align-right align-margin-top">
                            Max file size - {maxSize / 1000} KB
                        </div>
                    )}
                </div>
                {showPreview && this.state.file && this.state.file.preview && (
                    <div className="preview-image-container">
                        <div className="preview-image" style={{backgroundImage: `url(${this.state.file.preview})`}}/>
                    </div>
                )}
            </div>
        )
    }
}

export default FileInput;

