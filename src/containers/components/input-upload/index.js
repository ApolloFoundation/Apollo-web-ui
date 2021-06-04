import React from "react";
import Dropzone from "react-dropzone";
import $ from "jquery";
import UploadImg from "../../../assets/upload-icon.png";
import DownloadImg from "../../../assets/down-arrow.png";
import { NotificationManager } from "react-notifications";

const InputUpload = ({
  id,
  maxSize,
  type,
  accept,
  handleFileAccepted,
  handleFileRejected,
  handleFileReset,
  file,
  isDownload,
  isReset,
}) => {
  const onDropAccepted = (files) => {
    $(`#${id}`).prop("files", files);
    if (handleFileAccepted) handleFileAccepted(files);
  };

  const onDropRejected = () => {
    NotificationManager.error("Please select another file.", "Error", 5000);
    if (handleFileRejected) handleFileRejected();
  };

  const handleUploadTextFile = (e) => {
    e.stopPropagation();

    const atag = document.createElement("a");
    const data = new Blob([file.content], {
      type: "text/plain",
    });
    atag.href = URL.createObjectURL(data);
    atag.download = file.hasOwnProperty("path") ? file.path : "file.txt";
    atag.click();
  };

  const handleReset = (e, acceptedFiles) => {
    e.stopPropagation();
    if (handleFileReset) {
      handleFileReset();
    }
    acceptedFiles.splice(file, 1);
  };

  return (
    <Dropzone
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
      multiple={false}
      maxSize={maxSize}
      accept={type}
    >
      {({ getRootProps, getInputProps, acceptedFiles, isDragActive }) => (
        <div
          {...getRootProps()}
          className={`upload-block ${
            isDragActive ? "upload-block-active" : ""
          }`}
        >
          <input {...getInputProps()} accept={accept} />
          <div className={"d-none"} id={id} />
          <p className="flex-grow-1">
            {acceptedFiles.length > 0
              ? acceptedFiles.map((acceptedFile) => acceptedFile.name)
              : "Click or drag file to upload"}
          </p>
          {isReset && file ? (
            <button
              type="button"
              className="btn btn-sm ml-2 d-flex"
              onClick={(e) => handleReset(e, acceptedFiles)}
              title={"reset"}
            >
              <i class="zmdi zmdi-close"></i>
            </button>
          ) : (
            ""
          )}
          <img src={UploadImg} alt={""} />
          {isDownload && file ? (
            <button
              type="button"
              className="btn btn-sm ml-2 d-flex"
              onClick={handleUploadTextFile}
              title={"download"}
            >
              <img src={DownloadImg} alt={""} />
            </button>
          ) : (
            ""
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default InputUpload;
