import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import Footer from './FooterMulti';
import SelectProducts from './ep/selectProducts';
import ClientContactInfo from './ep/ClientContactInfo';
//import DpoaForm from './ep/DurablePoaForm';
import DpoaForm from './ep/DurablePoaForm';
import MpoaForm from './ep/MedicalPoaForm';
import HipaaForm from './ep/HipaaForm';
import WizardSummary from './ep/WizardSummary';
import FinalizeDocs from './ep/FinalizeDocs';

import { products } from 'pages/wizard';

const MultiStepForm = () => {
  const { activeStepIndex, steps, returnToStep, setStepIndex } =
    useContext(FormContext);
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );

  //Scroll to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let includeStep = true;
    const currentStepIsProduct = products.includes(steps[activeStepIndex]);
    // console.log('CURRENT STEP', steps[activeStepIndex]);
    // console.log('IS PRODUCT', currentStepIsProduct);
    if (currentStepIsProduct) {
      //this step contains information to complete a form for a product
      //includeStep = steps[activeStepIndex] in selectedProducts;
      const includedProducts = selectedProducts.map((sp) => {
        return sp.type.includes('-') ? sp.type.split('-')[1] : sp.type;
      });
      includeStep = includedProducts.includes(steps[activeStepIndex]);
      if (!includeStep) {
        setStepIndex(activeStepIndex + 1);
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
    <HipaaForm {...props} id={steps[4]} />,
    <WizardSummary {...props} id={steps[5]} />,
    <FinalizeDocs {...props} id={steps[6]} />,
  ];

  return (
    <div className="container">
      {stepComponents[activeStepIndex]}
      <Footer id={steps[activeStepIndex]} {...props} />
    </div>
  );
};

export default MultiStepForm;
