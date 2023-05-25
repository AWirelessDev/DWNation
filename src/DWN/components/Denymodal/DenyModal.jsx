import { Button, Modal } from "react-bootstrap";
import { Form, Container } from "react-bootstrap";
import { useState } from "react";

export function DenyModal() {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [label, setLabel] = useState("");

  const [reasonTouched, setReasonTouched] = useState(false);
  const [labelTouched, setLabelTouched] = useState(false);

  const reasonIsValid = reason.trim() !== "" && reason.length > 1;
  const labelIsValid = label.includes("j") || label.includes("d");

  const reasonInputIsInvalid = !reasonIsValid && reasonTouched;
  const labelInputIsInvalid = !labelIsValid && labelTouched;

  const handleSubmit = (event) => {
    event.preventDefault();
    setReasonTouched(true);
    setLabelTouched(true);
    if (!reasonIsValid && !labelIsValid) {
      return;
    }
    setReason("");
    setLabel("");
    setReasonTouched(false);
    setLabelTouched(false);
    if (reasonIsValid && labelIsValid) setShow(false);
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="danger"
        value="deny"
        type="deny"
        onClick={handleShow}
        className="button"
      >
        Deny
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Reason for Denial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-container">
              <Form className="commomComponentForm">
                <Form.Group>
                  Please provide a reason for denying the request.
                  <div>
                    <label >Label:</label>
                    <Form.Select
                      id="label"
                      onChange={(e) => setLabel(e.target.value)}
                      onBlur={() => setLabelTouched(true)}
                      value={label}
                    >
                      <option>Select an Option</option>
                      <option value="j">West Area</option>
                      <option value="d">East Area</option>
                    </Form.Select>
                    {labelInputIsInvalid && (
                      <>
                        <p>
                          <small>Please Select an option</small>
                        </p>
                      </>
                    )}
                  </div>
                  <br></br>
                  <div>
                    <label >Reason: </label>
                    <Form.Control
                      id="name"
                      type="text"
                      name="name"
                      onChange={(e) => setReason(e.target.value)}
                      onBlur={() => setReasonTouched(true)}
                      value={reason}
                    ></Form.Control>
                    {reasonInputIsInvalid && (
                      <>
                        <p>
                          <small>Please Enter Reason</small>
                        </p>
                      </>
                    )}
                  </div>
                </Form.Group>
              </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <br></br>

          <Button
            variant="secondary"
            onClick={handleClose}
            className=""
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className=""
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
