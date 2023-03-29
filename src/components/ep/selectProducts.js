import React, { Fragment, useContext, useState, useEffect } from 'react';
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Spinner,
  Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import ProductCard from './ProductCard';
import SectionHeader from 'components/SectionHeader';
import { selectedProductsActions } from 'store/productsSlice';
import FormAlert from 'components/FormAlert';
import supabase from 'util/supabase';
import AspectRatio from 'components/AspectRatio';

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
      if (products) {
        setProducts(products);
      }
    };

    getProducts();
    window.scrollTo(0, 0);
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
    <Container className="text-center">
      <SectionHeader
        title="Select your Documents"
        subtitle="Choose which documents you want to create"
        size={2}
        spaced={true}
      />
      <Card>
        <Row className="no-gutters overflow-hidden">
          {products.map((product, index) => (
            <Col
              xs={12}
              lg={6}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                boxShadow: '1px 1px 0 0 #efefef',
              }}
              key={index}
            >
              <div className="FeaturesSection__item has-text-centered">
                {/* <div className="FeaturesSection__image-container">
                  <AspectRatio ratio={4 / 3}></AspectRatio>
            </div>*/}
                <h4>{product.title}</h4>
                <p>{product.text}</p>
                <Button
                  variant={prodSelected(product) ? 'danger' : 'primary'}
                  onClick={() => toggleProduct(product)}
                >
                  {prodSelected(product) ? 'Remove' : 'Select'}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
        {formError && selectedProducts.products.length === 0 && (
          <Row>
            <Col>
              <FormAlert type="error" message={formError} />
            </Col>
          </Row>
        )}

        <Form id={props.id} onSubmit={moveNext}></Form>
      </Card>
    </Container>
  );
};

export default SelectProducts;
