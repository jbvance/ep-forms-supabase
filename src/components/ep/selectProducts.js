import React, { Fragment, useContext, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import ProductCard from './ProductCard';
import { selectedProductsActions } from 'store/productsSlice';
import { apiRequest } from 'util/util';

const SelectProducts = (props) => {
  console.log('PROPS', props);
  const dispatch = useDispatch();
  const selectedProducts = useSelector((state) => state.selectedProducts);
  const { activeStepIndex, setActiveStepIndex } = useContext(FormContext);

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

  const productsInfo = [
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

  useEffect(() => {
    const callApi = async () => {
      const data = await apiRequest('list-files');
      console.log('DATA', data);
    };
    callApi();
  }, []);

  console.log('ENV', process.env);

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

      <Form
        id={props.id}
        onSubmit={() => setActiveStepIndex(activeStepIndex + 1)}
      ></Form>
    </Fragment>
  );
};

export default SelectProducts;
