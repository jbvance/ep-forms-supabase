import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import Button from 'react-bootstrap/Button';
import { products } from 'pages/wizard';

const Footer = (props) => {
  const { steps, activeStepIndex, setActiveStepIndex } =
    useContext(FormContext);
  const isLast = activeStepIndex === steps.length - 1;
  const isFirst = activeStepIndex === 0;
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );

  //console.log(steps);
  //console.log(steps[activeStepIndex]);

  const goBack = () => {
    // keep going back until we find a non-product form or
    // a product that was selected
    for (let i = activeStepIndex - 1; i > -1; i--) {
      if (!products.includes(steps[i]) || selectedProducts.includes(steps[i])) {
        setActiveStepIndex(i);
        break;
      }
    }
    // setActiveStepIndex(activeStepIndex - 1);
  };

  return (
    <React.Fragment>
      <hr />
      <div>
        {/* <div tabIndex={0} className={styles['footer-item']}> */}
        {!isFirst && (
          <Button
            variant="outline-success"
            className="WizardNavigateButton"
            type="button"
            onClick={goBack}
          >
            {`<< Back`}
          </Button>
        )}
        {/* </div> */}
        {/* <div tabIndex={0} className={styles['footer-item']}> */}

        <Button
          variant="outline-success"
          className="WizardNavigateButton"
          type="formik-submit"
          form={props.id}
        >
          {isFirst ? 'Next >>' : isLast ? 'Submit' : 'Next >>'}
        </Button>
        {/* </div> */}
      </div>
    </React.Fragment>
  );
};

export default Footer;
