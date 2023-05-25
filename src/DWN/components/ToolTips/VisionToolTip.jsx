import { Popover } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export const VisionToolTip = ({ placement, text, children }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={ <Popover id="popover-basic">
      <Popover.Body>
        {text}
      </Popover.Body>
    </Popover>}
    >
      <div>
      {children}

      </div>
    </OverlayTrigger>
  );
}
