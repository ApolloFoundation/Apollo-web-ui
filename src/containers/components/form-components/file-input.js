import React from 'react';

class FileInput extends React.Component {

    state = {};

    render () {
        const {setValue} = this.props;

        return (
            <div className="form-group row form-group-white mb-15">
                <label className="col-sm-3 col-form-label">
                    File
                </label>
                <div className="col-md-9">
                    <div className="iconned-input-field">
                        <div className="input-group-app search">
                            <div
                                style={{height: 32}}
                                className="iconned-input-field"
                            >
                                <div className="input-icon text"><i className="">Browse&hellip;</i></div>
                                <input
                                    id="file"
                                    type="file"
                                    placeholder="Recipient"
                                    onChange={(e) => {
                                        e.preventDefault();

                                        let reader = new FileReader();
                                        let file = e.target.files[0];


                                        reader.onloadend = () => {
                                            this.setState({
                                                ...this.state,
                                                file: file,
                                                imagePreviewUrl: reader.result
                                            });
                                        };

                                        setValue("messageIsText", false);
                                        setValue("messageIsPrunable", true);

                                        if(file) reader.readAsDataURL(file);

                                    }}
                                />
                                <div className={'input-file-area'}>
                                    <div className="input-file-name">
                                        {
                                            this.state.file &&
                                            this.state.file.name ? this.state.file.name : <span className={"no-file-selected"}>No file selected</span>
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
        )
    }
}

export default FileInput;

