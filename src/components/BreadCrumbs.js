import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import { FormContext } from 'context/formContext';
import { products } from 'pages/wizard';

const CrumbMap = {
  ['select-products']: 'Select Products',
  ['client-info']: 'Your Information',
  dpoa: 'Durable Power of Attorney',
  mpoa: 'Medical Power of Attorney',
  hipaa: 'HIPAA Authorization',
  directive: 'Directive to Physicians',
  summary: 'Summary',
  finalize: 'Review and Finalize',
};

const BreadCrumbs = (props) => {
  const { activeStepIndex, steps, returnToStep, setStepIndex } =
    useContext(FormContext);
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );
  const selectedProductsWithoutState = selectedProducts.map((sp) =>
    sp.type.includes('-') ? sp.type.split('-')[1] : sp.type
  );
  // Build a list of breadcrumbs based on what products are selected
  const showCrumbs = steps
    .map((step) => {
      if (
        !products.includes(step) ||
        selectedProductsWithoutState.includes(step)
      ) {
        return step;
      }
    })
    .filter((step) => !!step);

  const buildCrumbs = () => {
    let crumbsArr = [];
    for (let i = 0; i <= activeStepIndex; i++) {
      const item = steps[i];
      crumbsArr.push(
        <Breadcrumb.Item
          key={item}
          active={i === activeStepIndex}
          onClick={() => setStepIndex(i)}
        >
          {CrumbMap[item]}
        </Breadcrumb.Item>
      );
    }
    return crumbsArr;
  };
  return <Breadcrumb>{buildCrumbs()}</Breadcrumb>;
};

export default BreadCrumbs;
