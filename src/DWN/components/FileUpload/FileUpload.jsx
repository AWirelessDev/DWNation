import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faTrash,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { getAccessToken } from "../../../hooks/useFetch";
import { Dropdown } from "react-bootstrap";
import "./FileUpload.scss";
import { ReactToast } from "../Toast/ReactToast";

const fileTypes = [
  "JPEG",
  "PNG",
  "PDF",
  "DOC",
  "DOCX",
  "XLSX",
  "BMP",
  "JPG",
  "EXIF",
  "TIFF",
  "PPM",
  "PGM",
  "PBM",
  "PNM",
  "XLS",
  "TXT",
  "CSV",
];

export const Fileupload = ({
  name = null,
  streamIds = [],
  setStreamIds = null,
  documents = [],
  setDocuments = null,
  disabled = false,
  mdmWorkerId = null,
  handleDeleteFile = null,
  handleDownloadFile = null,
  multiple = false,
  isRequired = false,
}) => {
  const { accounts, instance } = useMsal();

  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;

  const handleChange = async (uploadedfile) => {
    const uploadedFiles = multiple ? uploadedfile : [uploadedfile];
    if (uploadedFiles?.length) {
      const accessToken = await getAccessToken(accounts, instance);
      const data = {
        ActivityType: 4,
        MdmEmployeeId: mdmWorkerId,
        FileName: uploadedFiles["0"]["name"],
      };
      let formData = new FormData();
      formData.append("fileUploadDetails", JSON.stringify(data));
      formData.append("file", uploadedFiles[0]);

      var requestOptions = {
        method: "POST",
        headers: {
          "x-functions-key": `${VITE_EVENTS_FUNCTION_KEY_PMC}`,
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };
      fetch(`${VITE_REACT_URL_API_PMC}/UploadDocuments`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const res = result.slice(13, 49);
          setStreamIds([...streamIds, res]);
          setDocuments([...documents, ...uploadedFiles]);
        })
        .catch((error) => console.log("error", error));
    }
  };

  const [errorMessage, setErrorMessage] = useState(false);
  return (
    <div className={`UploadElement`}>
      {errorMessage && (
        <ReactToast
          title={"Error"}
          position={"top-center"}
          classbg="danger"
          handleClose={() => setErrorMessage(false)}
          className="error-toast-message"
        >
          <div>File size is more than 10 MB.</div>
        </ReactToast>
      )}
      {!multiple && documents?.length > 0 ? null : (
        <FileUploader
          multiple={multiple}
          handleChange={(uploadedfile) => handleChange(uploadedfile)}
          name="file"
          types={fileTypes}
          className="mt-2"
          disabled={disabled}
          maxSize={10}
          onSizeError={() => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setErrorMessage(true);
          }}
          classes={`${
            isRequired && documents.length < 1 ? "drop-zone-error" : ""
          }`}
        />
      )}
      <span>
        {documents?.map((document, index) => {
          return (
            <div key={`${name}-${index}`} className="file-upload-document">
              <Dropdown>
                <Dropdown.Toggle
                  variant="default"
                  id="dropdown-basic"
                  split
                  className="file-upload-block"
                >
                  <span className="file-name">
                    {document["name"] || document["fileName"]}
                  </span>
                  &nbsp; &nbsp;{" "}
                  <FontAwesomeIcon
                    size={"lg"}
                    icon={faChevronDown}
                    color={"#616870"}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href=""
                    onClick={() => handleDownloadFile(name, index)}
                  >
                    Download
                    <FontAwesomeIcon
                      size={"lg"}
                      icon={faDownload}
                      className="fa-download-icon"
                    />
                  </Dropdown.Item>
                  {!disabled && (
                    <Dropdown.Item
                      href=""
                      onClick={() => handleDeleteFile(name, index)}
                    >
                      Delete
                      <FontAwesomeIcon
                        size={"lg"}
                        icon={faTrash}
                        className="fa-trash-icon"
                      />
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        })}
      </span>
    </div>
  );
};
