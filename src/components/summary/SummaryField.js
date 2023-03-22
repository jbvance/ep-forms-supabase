import React from 'react';
import { Col } from 'react-bootstrap';

const SummaryField = ({ spanCols = 4, fontWeight = 500, label, text }) => {
  return (
    <Col md={spanCols} className="SummaryField">
      <span style={{ fontWeight }}>{label} </span>
      <br /> {text}
    </Col>
  );
};

export default SummaryField;
