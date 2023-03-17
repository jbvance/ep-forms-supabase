import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ProductCard = ({ title, text, selected, onToggle }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
        <Button variant={selected ? 'danger' : 'primary'} onClick={onToggle}>
          {selected ? 'Remove' : 'Select'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
