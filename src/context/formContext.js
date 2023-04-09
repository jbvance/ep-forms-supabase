import { createContext } from 'react';
export const FormContext = createContext({
  activeStepIndex: 0,
  gotoStep: (stepName) => {},
  setStepIndex: (index) => {},
  returnToStep: '',
  steps: [],
  crumbSteps: [],
  addStepToCrumbs: (index) => {},
  removeStepFromCrumbs: (index) => {},
  userIdForUpdate: null,
  setUserIdForUpdate: (id) => {},
});
