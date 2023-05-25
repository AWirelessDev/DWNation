import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Error401,
  Error404,
  Error500,
  ErrorDefault,
  IconReload,
} from "../../components/Svg";
import "./ErrorPage.scss";
import { ReactToast } from "../../components/Toast/ReactToast";

export const ErrorPage = ({
  code: propCode = "",
  className = "",
  isToast = false,
  isTextMsg = false,
}) => {
  const { code: paramCode } = useParams();
  const code = propCode || paramCode;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [buttonTxt, setButtonTxt] = useState("Go to dashboard");
  const [toastMessage, setToastMessage] = useState(null);

  const codeStr = code?.toString();

  useEffect(() => {
    if (isTextMsg) {
      switch (codeStr) {
        case "204":
          setToastMessage(
            "No Content: The request was invalid or cannot be served."
          );
          break;
        case "400":
          setToastMessage(
            "Bad Request: The request was invalid or cannot be served."
          );
          break;
        case "403":
          setToastMessage(
            "Forbidden: The user is authenticated but does not have access to the resource."
          );
          break;
        case "404":
          setToastMessage(
            "Resource not found: We can't seem to find the resource you're looking for."
          );
          break;
        case "405":
          setToastMessage(
            "Method Not Allowed: The requested method is not allowed for the resource."
          );
          break;
        case "500":
          setToastMessage(
            "Internal Server Error: An unexpected condition was encountered on the server."
          );
          break;
        case "502":
          setToastMessage(
            "Bad Gateway: The server received an invalid response from an upstream server."
          );
          break;
        case "503":
          setToastMessage(
            "Service Unavailable: The server is currently unable to handle the request due to a"
          );
          break;
        default:
          setToastMessage("Something went wrong");
          break;
      }
    } else {
      switch (codeStr) {
        case "404":
          setTitle("Oops!");
          setMessage("We can't seem to find the page you're looking for.");
          setButtonTxt("Go to dashboard");
          break;
        case "401":
          setTitle("Unauthorized");
          setMessage("Access denied due to invalid credentials");
          setButtonTxt("Go to login page");
          break;
        case "403":
          setTitle("Service Unavailable: ");
          setMessage(
            "The server is currently unable to handle the request due to a"
          );
          setButtonTxt("Refresh page");
          break;
        case "503":
          setTitle("Service Unavailable: ");
          setMessage(
            "The server is currently unable to handle the request due to a"
          );
          setButtonTxt("Refresh page");
          break;
        case "500":
          setTitle("Internal server error");
          setMessage("An unexpected condition was encountered on the server");
          setButtonTxt("Refresh page");
          break;

        default:
          setTitle("Error");
          setMessage("Something went wrong");
          setButtonTxt("Go to dashboard");
          setToastMessage("Something went wrong");
          break;
      }
    }
  }, [code]);

  const handleDestination = (code = "404") => {
    let navTo;

    switch (codeStr) {
      case "401":
        navTo = navigate(`/login`);
        break;
      case "404":
        navTo = navigate(`/dashboard`);
        break;
      case "500":
        navTo = window.history.back();
        break;
      default:
        navTo = navigate(`/dashboard`);
        break;
    }
    return navTo;
  };

  const handleClose = () => {
    setShowAfSave(false);
  };

  return (
    <>
      {isTextMsg && (
        <div className={className || "error-toast-message"}>{toastMessage}</div>
      )}
      {isToast && (
        <ReactToast
          className="error-toast-message"
          handleClose={() => setToastMessage(null)}
          {...toastMessage}
        />
      )}
      {!isToast && !isTextMsg && (
        <div id="errorPage" className={`px-sm-3 errorPage ${className}`}>
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-6">
              <div className="d-flex flex-column justify-content-center text-lg-end pe-lg-2 h-100">
                <div className={`title e-${code}`}>{title}</div>
                <div className="message">{message}</div>
                {code && (
                  <div className="code">
                    <strong>Error Code: {code}</strong>
                  </div>
                )}
                <div className="url">{location.href}</div>
                <div className="action">
                  <div
                    className="goBack"
                    onClick={() => handleDestination(code)}
                  >
                    {code === "500" ? <IconReload /> : <ArrowLeft />}
                    {buttonTxt}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 col-md-6">
              <div className="svgImage">
                {code === "404" ? (
                  <Error404 />
                ) : code === "401" ? (
                  <Error401 />
                ) : code === "500" ? (
                  <Error500 />
                ) : (
                  <ErrorDefault />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
