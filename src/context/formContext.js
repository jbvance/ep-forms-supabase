import { createContext } from 'react';
export const FormContext = createContext({
  activeStepIndex: 0,
  setActiveStepIndex: (prevState) => {},
  steps: [],
});
