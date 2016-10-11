import { isFSA } from 'flux-standard-action';

export default (track, select = ({ meta }) => meta.analytics) => store => next => action => {
  const returnValue = next(action);

  if (!action || !action.meta) {
    return returnValue;
  }

  const eventOrEvents = select(action);

  let events = !Array.isArray(eventOrEvents) ? [eventOrEvents] : eventOrEvents;
  events = events.filter(event => Boolean(event));

  if (!events.length) {
    return returnValue;
  }

  events.forEach(event => {
    if (!isFSA(event)) {
      const message = "The following event wasn't tracked because it isn't a Flux Standard Action (https://github.com/acdlite/flux-standard-action)";
      console.error(message, event);
      return;
    }

    track(event, store.getState());
  });


  return returnValue;
};
