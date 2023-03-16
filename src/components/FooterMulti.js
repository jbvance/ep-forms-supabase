import React, { useContext } from 'react';
import { FormContext } from 'context/formContext';
import Button from 'react-bootstrap/Button';

const Footer = (props) => {
  const { steps, activeStepIndex, setActiveStepIndex } =
    useContext(FormContext);
  const isLast = activeStepIndex === steps.length - 1;
  const isFirst = activeStepIndex === 0;

  //console.log(steps);

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
            onClick={() => setActiveStepIndex(activeStepIndex - 1)}
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
          {isFirst ? 'Next >>' : isLast ? 'Submit' : 'Next'}
        </Button>
        {/* </div> */}
      </div>
    </React.Fragment>
  );
};

export default Footer;
