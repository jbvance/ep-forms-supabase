import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from 'util/auth';
import { FormContext } from 'context/formContext';
import MultiStepForm from '../components/MultiStepForm';
import { requireAuth } from 'util/auth';
import { getSpouseInfo } from 'util/db';

import FormAlert from 'components/FormAlert';
// products is a list of the documents that require user information to be filled out.
export const products = ['dpoa', 'mpoa', 'hipaa'];
const steps = [
  'select-user',
  'select-products',
  'client-info',
  'dpoa',
  'mpoa',
  'hipaa',
  'summary',
  'finalize',
];

const WizardPage = (props) => {
  const auth = useAuth();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [returnToStep, setReturnToStep] = useState('');
  const [crumbSteps, setCrumbSteps] = useState([]);
  const dispatch = useDispatch();
  const [userIdForUpdate, setUserIdForUpdate] = useState(null);
  const [isSpouse, setIsSpouse] = useState(false);
  const primaryUserId = auth.user.id;

  useEffect(() => {
    console.log('SETTING USER ID FOR UPDATE');
    const getUpdateUserId = async () => {
      // Only update user id to spouse's if isSpouse === true
      if (isSpouse === false) {
        setUserIdForUpdate(primaryUserId);
        return;
      } else {
        const { spouses } = await getSpouseInfo(primaryUserId);
        //console.log('SPOUSES', spouses.length, spouses);
        if (spouses && spouses.length > 0) {
          setUserIdForUpdate(spouses[0].id);
        } else {
          const { error, data: newSpouse } = await supabase
            .from('spouses')
            .insert({ user_id: primaryUserId })
            .select()
            .single();
          console.log('ERROR', error);
          setUserIdForUpdate(newSpouse.id);
        }
      }
    };

    getUpdateUserId();
  }, [isSpouse]);

  const setStepIndex = (index) => {
    if (returnToStep !== '') {
      setReturnToStep('');
      return setActiveStepIndex(
        steps.findIndex((step) => step === returnToStep)
      );
    }
    setActiveStepIndex(index);
  };

  const gotoStep = (stepName, returnToStepName = '') => {
    const stepIndex = steps.findIndex((s) => s === stepName);
    if (returnToStepName) {
      setReturnToStep(returnToStepName);
    }
    if (stepIndex) {
      setActiveStepIndex(stepIndex);
      //setStepIndex(stepIndex);
    }
  };

  const addStepToCrumbs = (index) => {
    const stepToMark = steps[index];
    if (stepToMark && !crumbSteps.includes(stepToMark)) {
      setCrumbSteps([...crumbSteps, stepToMark]);
    }
  };

  const removeStepFromCrumbs = (stepNameToRemove) => {
    const stepsCopy = [...crumbSteps];
    if (stepNameToRemove && crumbSteps.includes(stepNameToRemove)) {
      const indexToRemove = stepsCopy.findIndex(
        (step) => step === stepNameToRemove
      );
      if (indexToRemove > -1) {
        stepsCopy.splice(indexToRemove, 1);
        setCrumbSteps([...stepsCopy]);
      }
    }
  };

  return (
    <FormContext.Provider
      value={{
        activeStepIndex,
        setActiveStepIndex,
        steps,
        gotoStep,
        setStepIndex,
        crumbSteps,
        addStepToCrumbs,
        removeStepFromCrumbs,
        setCrumbSteps,
        userIdForUpdate,
        setUserIdForUpdate,
        isSpouse,
        setIsSpouse,
      }}
    >
      <MultiStepForm />
    </FormContext.Provider>
  );
};

export default requireAuth(WizardPage);
