import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const StripeConfirmPage = (props) => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Your Payment Successful!</h2>
        </Col>
      </Row>
      <Row>
        <Col className="StripeConfirmLink">
          <Link className="StripeConfirmLink" href="/dashboard-files">
            Click here to view your completed documents
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default StripeConfirmPage;
