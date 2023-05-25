import React from "react";
import { SimpleModal } from "../../../components";

const LocationsModal = ({ locations, title = null }) => {
  const [modal, setModal] = React.useState(false);
  const handleRenderLocations = (isModal = false) => {
    return locations?.map((location, i) => {
      return (
        <div
          className={`${isModal ? "locations-modal pe-2" : "locations pe-2"}`}
          key={location?.mdmWorkerLocationLevelId?.toString() + `${i}`}
        >
          <a title={location?.locationName}>
            <i className="fa-regular fa-location-dot pe-2"></i>
            <span>{location?.locationName}</span>
          </a>
        </div>
      );
    });
  };
  let renderComponents = null;
  if (locations.length === 0) {
    renderComponents = <span className="locations ps-2">Not Assigned</span>;
  } else if (locations.length <= 6) {
    renderComponents = handleRenderLocations();
  } else if (locations?.length > 6) {
    renderComponents = (
      <>
        {modal && (
          <SimpleModal
            title={title}
            handleClose={() => setModal(false)}
            size="lg"
          >
            <div className="row row-cols-1 row-cols-sm-3 row-cols-md-6 row-cols-lg-9 row-cols-xl-12 center-sm">
              {handleRenderLocations(true)}
            </div>
          </SimpleModal>
        )}
        {locations?.map((location, i) => {
          if (i < 5) {
            return (
              <div
                className="locations pe-2"
                key={location?.mdmWorkerLocationLevelId?.toString() + `${i}`}
              >
                <a title={location?.locationName}>
                  <i className="fa-regular fa-location-dot pe-2"></i>
                  <span>{location?.locationName}</span>
                </a>
              </div>
            );
          } else if (i === 5) {
            return (
              <div className="locations pe-2 cursor-pointer" key={`${i}`}>
                <a
                  href="#"
                  className="cursor-pointer"
                  onClick={() => setModal(true)}
                >
                  Show more locations
                </a>
              </div>
            );
          }
        })}
      </>
    );
  }
  return (
    <div className="row row-cols-1 row-cols-sm-3 row-cols-md-6 row-cols-lg-9 row-cols-xl-12 center-sm">
      {renderComponents}
    </div>
  );
};

export default LocationsModal;
