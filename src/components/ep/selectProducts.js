import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import ProductCard from './ProductCard';
import { selectedProductsActions } from 'store/productsSlice';
import FormAlert from 'components/FormAlert';

export const productsInfo = [
  {
    type: 'dpoa',
    title: 'Durable Power of Attorney',
    text: 'Used to name who will make your financial decisions for you.',
  },
  {
    type: 'mpoa',
    title: 'Medical Power of Attorney',
    text: "Appoint someone to make healthcare decisions on your behalf if you can't",
  },
];

const SelectProducts = (props) => {
  const dispatch = useDispatch();
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const { activeStepIndex, setActiveStepIndex } = useContext(FormContext);
  const [formError, setFormError] = useState(null);

  const prodSelected = (prod) => {
    const found = selectedProducts.products.find((p) => p === prod);
    return found ? true : false;
  };

  const toggleProduct = (prod) => {
    const found = selectedProducts.products.find((p) => p === prod);
    if (!found) {
      dispatch(selectedProductsActions.addProduct(prod));
    } else {
      dispatch(selectedProductsActions.removeProduct(prod));
    }
  };

  const moveNext = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedProducts.products || selectedProducts.products.length < 1) {
      setFormError('Please select at least one form to continue');
      return;
    }
    setActiveStepIndex(activeStepIndex + 1);
  };

  return (
    <Fragment>
      <Row className="no-gutters overflow-hidden">
        {productsInfo.map((product) => {
          return (
            <Col xs={12} lg={6} key={product.type}>
              <ProductCard
                title={product.title}
                text={product.text}
                selected={prodSelected(product.type)}
                onToggle={() => toggleProduct(product.type)}
              />
            </Col>
          );
        })}
      </Row>
      {formError && selectedProducts.products.length === 0 && (
        <Row>
          <Col>
            <FormAlert type="error" message={formError} />
          </Col>
        </Row>
      )}

      <Form id={props.id} onSubmit={moveNext}></Form>
    </Fragment>
  );
};

export default SelectProducts;
