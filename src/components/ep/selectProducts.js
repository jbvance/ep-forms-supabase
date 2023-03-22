import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import ProductCard from './ProductCard';
import { selectedProductsActions } from 'store/productsSlice';
import FormAlert from 'components/FormAlert';
import supabase from 'util/supabase';

const SelectProducts = (props) => {
  const dispatch = useDispatch();
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);
  const [products, setProducts] = useState([]);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      const { data: products, error } = await supabase
        .from('document_types')
        .select();
      console.log(products);
      if (products) {
        setProducts(products);
      }
      console.log('PRODUCTS', products);
    };

    getProducts();
  }, []);

  const prodSelected = (prod) => {
    const found = selectedProducts.products.find((p) => p.type === prod.type);
    return found ? true : false;
  };

  const toggleProduct = (prod) => {
    const found = selectedProducts.products.find((p) => p.type === prod.type);
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
    setStepIndex(activeStepIndex + 1);
  };

  if (!products) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <h1 className="Header">Select the documents you would like to create</h1>
      <p className="Informational">
        Note: If you select a document that you have created previously,
        creating the same document again will replace any existing documents
        that have been saved. Before completing a new version, you may want to{' '}
        <a href="/dashboard-files">click here</a> to download any existing
        versions.
      </p>
      <Row className="no-gutters overflow-hidden">
        {products.map((product) => {
          return (
            <Col xs={12} lg={6} key={product.type}>
              <ProductCard
                title={product.title}
                text={product.text}
                selected={prodSelected(product)}
                onToggle={() => toggleProduct(product)}
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
