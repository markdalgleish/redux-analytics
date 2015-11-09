import { isFSA } from 'flux-standard-action';

export default track => store => next => action => {
  const returnValue = next(action);

  if (!action || !action.meta || !action.meta.analytics) {
    return returnValue;
  }

  if (!isFSA(action.meta.analytics)) {
    console.error("The following event wasn't tracked because it isn't a Flux Standard Action (https://github.com/acdlite/flux-standard-action)", action.meta.analytics);
    return returnValue;
  }

  track(action.meta.analytics, store.getState());

  return returnValue;
};
