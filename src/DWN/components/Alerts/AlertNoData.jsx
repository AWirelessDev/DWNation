import React from 'react'
import { Alert } from "react-bootstrap";
import "./Alerts.scss";

export const AlertNoData = () => {
  return (
    <Alert variant="primary" className='NoData'>
        No data is available to display.
      </Alert> 
  )
}
