import { ArtemisReducerActions713, reducer713 } from '../7.13/reducer';
import { FormStateRestricted } from './import-types';

// Operations for Restricted start at number 4000
export enum ArtemisReducerOperationsRestricted {
  setIsRestrited = 4000,
}

export type ReducerActionBase = {
  operation: ArtemisReducerOperationsRestricted;
};

interface SetIsRestricted extends ReducerActionBase {
  operation: ArtemisReducerOperationsRestricted.setIsRestrited;
  /** set to true if the deployment is in restricted mode*/
  payload: boolean;
}

// Restricted is 7.13 + extras
export type ArtemisReducerActionsRestricted =
  | ArtemisReducerActions713
  | SetIsRestricted;

export const reducerRestricted: React.Reducer<
  FormStateRestricted,
  ArtemisReducerActionsRestricted
> = (prevFormState, action) => {
  const formState = { ...prevFormState };

  switch (action.operation) {
    case ArtemisReducerOperationsRestricted.setIsRestrited:
      if (action.payload) {
        formState.cr.spec.restricted = true;
      } else {
        delete formState.cr.spec.restricted;
      }
      return formState;
    default:
      return reducer713(
        formState,
        action as ArtemisReducerActions713,
      ) as FormStateRestricted;
  }
};

export const areMandatoryValuesSetRestricted = (
  formState: FormStateRestricted,
) => {
  // if the user wants restricted mode, ensure everything is correctly defined
  if (formState.cr.spec.restricted) {
    // for now, forbid a restricted deployment
    return false;
  }
  return true;
};
