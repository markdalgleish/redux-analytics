import { isFSA } from 'flux-standard-action';

export default track => store => next => action => {
  if (!action || !action.meta || !isFSA(action.meta.analytics)) {
    return next(action);
  }

  const returnValue = next(action);

  track(action.meta.analytics, store.getState());

  return returnValue;
};
