import { Modal } from "react-bootstrap";
import { Buttons } from "../Buttons/Buttons";
import PropTypes from "prop-types";

export const SimpleModal = (props) => {
  const { handleClose, title, children, buttons, size, drop, closeButton, showFooter } = props;
  return (
    <Modal
      show
      onHide={handleClose ? handleClose : null}
      size={size}
      backdrop={drop}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton={ closeButton || false}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {showFooter &&
      <Modal.Footer>
        <Buttons buttons={buttons} />
      </Modal.Footer>}
    </Modal>
  );
};

SimpleModal.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.any,
  buttons: PropTypes.array,
  size: PropTypes.string,
  showFooter: PropTypes.bool,
};

SimpleModal.defaultProps = {
  size: "lg",
  closeButton: true,
  buttons: [],
  children: null,
  title: null,
  showFooter: true,
};
