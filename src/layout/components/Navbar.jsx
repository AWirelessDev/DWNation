import { useContext, useEffect, useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useMsal } from "@azure/msal-react";
import { RoleContext } from "../../DWN/provider";
import { SimpleModal } from "../../DWN/components";
import { PeopleDropDown } from "../../DWN/pages/DashboardPage/components/PeopleDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand } from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-bootstrap/Spinner";
import BinaryImage from "../../DWN/components/BinaryImage/BinaryImage";
import "./Navbar.scss";

export const Navbar = () => {
  const { accounts, instance } = useMsal();
  const RoleCtx = useContext(RoleContext);
  const [showModal, setShowModal] = useState(false);
  const [showModalVersion, setShowModalVersion] = useState(false);
  const [visibleshow, setvisibleshow] = useState(false);
  //const [impersonation, setImpersonation] = useState(false);
  const impersonation = RoleCtx.impersonation || false;
  const setImpersonation = RoleCtx.setImpersonation;
  const setImpersEmail = RoleCtx.setImpersEmail;
  const [selectedImperson, setSelectedImperson] = useState(null);
  const [userOn, setUserOn] = useState(null);
  const [userOnLastName, setUserOnLastName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const name = accounts[0] && accounts[0].name;

  let Roles = [];

  const buttons = [
    {
      name: "Close",
      variant: "outline-secondary",
      handleClick: () => handleClose(),
    },
    {
      name: "Confirm",
      variant: "primary",
      handleClick: () => OnHandleImpersonate(),
      className: "btn-confirm-primary",
    },
  ];

  const buttonsVersion = [
    {
      name: "Refresh",
      variant: "primary",
      handleClick: () => OnHandleNewversion(),
      className: "btn-confirm-primary",
    },
  ];

  const handleImpersonationChange = () => {
    const image =
      RoleCtx.impersonation && RoleCtx.data.image
        ? RoleCtx.data.image
        : RoleCtx.loginUserData.image;
    setProfileImage(image);
  };

  useEffect(() => {
    handleImpersonationChange();
  }, [RoleCtx.impersonation, RoleCtx.data.image, RoleCtx.loginUserData.image]);

  const OnHandleNewversion = () => {
    setShowModalVersion(!showModalVersion);
    window.location.reload();
  };

  const handleNavLinks = () => {
    if (RoleCtx?.loginUserData.roles != null) {
      Roles = RoleCtx?.loginUserData.roles.filter(
        (role) => role === "Impersonation"
      );
      Roles.length > 0 ? setvisibleshow(true) : setvisibleshow(false);
    }
  };

  const handleImpersonation = () => {
    if (impersonation === false) {
      setShowModal(true);
    } else {
      setImpersonation(false);
    }
  };
  const handleStopImpersonation = () => {
    setShowModal(false);
    setImpersonation(false);
  };

  const handleClose = () => {
    setShowModal(!showModal);
  };

  const handleCloseVersion = () => {
    setShowModalVersion(!showModalVersion);
  };

  const OnHandleImpersonate = () => {
    setShowModal(!showModal);
    if (selectedImperson != null) {
      setImpersonation(true);

      const str = selectedImperson.label
        .split(" | ")
        .slice(0, -1)
        .join(" ")
        .split(" ")
        .slice(0, -1)
        .join(" ");
      const arr = str.trim().split(/\s+/);

      setUserOn(arr[0].trim());
      setUserOnLastName(arr[1].trim());
      setImpersEmail(
        selectedImperson.label.split("|").slice(1, 2).toString().trim()
      );
    }
  };

  const handleChangeImperson = (e) => {
    setSelectedImperson(e);
    setvisibleshow(true);
  };

  const onLogout = () => {
    instance.logoutRedirect();
    sessionStorage.clear();
    localStorage.removeItem("impersonEmail");
  };

  const renderUserDetails = () => {
    return (
      <>
        {impersonation ? (
          <div className="navbar-profile-name user-impersonating">
            <div>{userOn || (RoleCtx.data.name ? RoleCtx.data.name.split(" ").slice(0, -1) : '')}</div>
            <div className="pmc-employee-last-name">
              {userOnLastName || (RoleCtx.data.name ? RoleCtx.data.name.split(" ").slice(1) : '')}
            </div>
          </div>
        ) : (
          <>
            <div className="navbar-profile-name">
              <div>{name.split(" ").slice(0, -1).join(" ")}</div>
              <div className="pmc-employee-last-name">
                {name.split(" ").slice(-1).join(" ")}
              </div>
            </div>
            <div className="navbar-profile-image">
              <BinaryImage
                key={`image-${profileImage}`}
                base64Data={profileImage}
                altText={"My picture Profile"}
                altClassName="employee-img"
                isNavBar="true"
              />
            </div>
          </>
        )}

        {impersonation && (
          <div className="navbar-profile-image">
            <Spinner
              animation="grow"
              variant="dark"
              className="notification-impersonating"
            />
            <BinaryImage
              key={`image-${profileImage}`}
              base64Data={profileImage}
              altText={"My picture Profile"}
              altClassName="employee-img"
              isNavBar="true"
            />
          </div>
        )}
      </>
    );
  };

  // ----- Begin Control Version Validation -----
  function getDeploymentVersion() {
    const version =
      import.meta.env.VITE_REACT_APP_DEPLOYMENT_VERSION || "1.0.0";
    return version;
  }

  function validateVersion() {
    const version = getDeploymentVersion();
    const versionFromLocalStorage = localStorage.getItem("version");
    if (versionFromLocalStorage === null) {
      localStorage.setItem("version", version);
      return;
    }
    if (versionFromLocalStorage !== version) {
      //setShowModalVersion(true);
      localStorage.setItem("version", version);
    }
  }

  validateVersion();
  // ----- End Control Version Validation -----

  return (
    <nav className="navbar navbar-expand navbar-dark">
      <div className="container-fluid">
        <div className="navbar-brand">
          <a
            href="https://vision.victra.com/"
            target="_self"
            className="headerLogo"
          >
            <div className="v3-vLogo"></div>
          </a>
        </div>
        <div className="ms-auto">
          <ul className="d-flex align-items-center my-auto p-0">
            <li className="nav-item nav-link me-3 cursor-pointer">
              <div
                onClick={onLogout}
                className="nav-bar-logout-icon"
                title="Logout"
              />
            </li>
            <li className="nav-item nav-link cursor-pointer">
              <NavDropdown
                title={renderUserDetails()}
                onClick={handleNavLinks}
                id="basic-nav-dropdown"
                className="mt-0 w-100 profile-dropdown"
                align="end"
              >
                {visibleshow && (
                  <NavDropdown.Item onClick={handleImpersonation}>
                    {impersonation && (
                      <span
                        onClick={handleStopImpersonation}
                        className="StopBtn"
                      >
                        <FontAwesomeIcon icon={faHand} /> Stop
                      </span>
                    )}{" "}
                    Impersonate
                  </NavDropdown.Item>
                )}

                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </li>
          </ul>
        </div>
        {showModal && (
          <SimpleModal
            showModal={showModal}
            title={"Impersonate"}
            handleClose={handleClose}
            buttons={buttons}
          >
            <div>
              <PeopleDropDown
                id="serchPeopIm"
                label="Employee"
                name="reportsTo"
                value={null}
                onInputChange={handleChangeImperson}
                editable={false}
                placeholder="Search by name"
              />
            </div>
          </SimpleModal>
        )}
        {showModalVersion && (
          <SimpleModal
            showModal={showModalVersion}
            title={"New Version Available"}
            buttons={buttonsVersion}
            handleClose={handleCloseVersion}
            closeButton={false}
            drop="static"
            keyboard={false}
          >
            <div>
              <h5>
                Please click on "Refresh" to get the latest version of this app.
              </h5>
            </div>
          </SimpleModal>
        )}
      </div>
    </nav>
  );
};
