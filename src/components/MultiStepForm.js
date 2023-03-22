import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import Footer from './FooterMulti';
import SelectProducts from './ep/selectProducts';
import ClientContactInfo from './ep/ClientContactInfo';
import DpoaForm from './ep/DurablePoaForm';
import MpoaForm from './ep/MedicalPoaForm';
import FinalizeDocs from './ep/FinalizeDocs';

import { products } from 'pages/wizard';

const MultiStepForm = () => {
  const { setActiveStepIndex, activeStepIndex, steps } =
    useContext(FormContext);
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );

  //Scroll to top of screen each time a step is rendered
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    let includeStep = true;
    const currentStepIsProduct = steps[activeStepIndex] in products;
    //const currentStepIsProduct = products.includes(steps[activeStepIndex]);
    if (currentStepIsProduct) {
      //this step contains information to complete a form for a product
      includeStep = steps[activeStepIndex] in selectedProducts;
      //includeStep = selectedProducts.includes(steps[activeStepIndex]);
      if (!includeStep) {
        setActiveStepIndex(activeStepIndex + 1);
      }
    }
  });

  const props = {
    isFirst: activeStepIndex === 0,
    isLast: activeStepIndex === steps.length - 1,
  };

  const stepComponents = [
    <SelectProducts id={steps[0]} />,
    <ClientContactInfo {...props} id={steps[1]} />,
    <DpoaForm {...props} id={steps[2]} />,
    <MpoaForm {...props} id={steps[3]} />,
    <FinalizeDocs {...props} id={steps[4]} />,
  ];

  return (
    <div className="container">
      {stepComponents[activeStepIndex]}
      <Footer id={steps[activeStepIndex]} {...props} />
    </div>
  );
};

export default MultiStepForm;
