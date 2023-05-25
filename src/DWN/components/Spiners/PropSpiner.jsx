import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';

export const PropSpiner = (props) => {
    const { label } = props;
  return (
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden"> { label } </span>
    </Spinner>
  );
}

PropSpiner.propTypes = {
    label: PropTypes.string,
};

PropSpiner.defaultProps = {
    label: 'Loading ...',
};

export default PropSpiner;