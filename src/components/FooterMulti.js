import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import Button from 'react-bootstrap/Button';
import { ArrowRightCircle, ArrowLeftCircle } from 'react-bootstrap-icons';
import { products } from 'pages/wizard';

const Footer = (props) => {
  const { steps, activeStepIndex, setStepIndex } = useContext(FormContext);
  const isLast = activeStepIndex === steps.length - 1;
  const isFirst = activeStepIndex === 0;
  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );

  const includedProducts = selectedProducts.map((sp) => {
    return sp.type.includes('-') ? sp.type.split('-')[1] : sp.type;
  });

  //console.log(steps);
  //console.log(steps[activeStepIndex]);

  const goBack = () => {
    //console.log('GOING BACK', activeStepIndex);
    // keep going back until we find a non-product form or
    // a product that was selected
    for (let i = activeStepIndex - 1; i > -1; i--) {
      if (!products.includes(steps[i]) || includedProducts.includes(steps[i])) {
        setStepIndex(i);
        break;
      }
    }
    // setStepIndex(activeStepIndex - 1);
  };

  return (
    <React.Fragment>
      <hr />
      <div>
        {/* <div tabIndex={0} className={styles['footer-item']}> */}
        {!isFirst && (
          <Button
            className="WizardNavigateButton"
            variant="tertiary"
            type="button"
            onClick={goBack}
          >
            <span>
              <ArrowLeftCircle style={{ marginRight: '10px' }} size={20} />
              Back
            </span>
          </Button>
        )}
        {/* </div> */}
        {/* <div tabIndex={0} className={styles['footer-item']}> */}

        <Button
          className="WizardNavigateButton"
          variant="tertiary"
          type="formik-submit"
          form={props.id}
        >
          {isFirst ? (
            <span>
              Save and Continue
              <ArrowRightCircle style={{ marginLeft: '10px' }} size={20} />
            </span>
          ) : isLast ? (
            'Submit'
          ) : (
            <span>
              Save and Continue
              <ArrowRightCircle style={{ marginLeft: '10px' }} size={20} />
            </span>
          )}
        </Button>
        {/* </div> */}
      </div>
    </React.Fragment>
  );
};

export default Footer;
