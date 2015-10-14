import { assert } from 'chai';
import { spy } from 'sinon';
import { createStore, applyMiddleware } from 'redux';
import analytics from '../src';

describe('Given: A Store with analytics middleware', () => {

  let store;
  let eventCallbackSpy;

  beforeEach(() => {
    eventCallbackSpy = spy();
    const createStoreWithMiddleware = applyMiddleware(analytics(eventCallbackSpy))(createStore);
    const initialState = { ignore: 'me', analytics: { abc: 123 } };
    const reducer = (state = initialState, action) => {
      switch (action.type) {
        case 'ADD_SOMETHING': {
          return {
            ...state,
            analytics: { ...state.analytics, added: true }
          };
        }

        default: {
          return state;
        }
      }
    }
    store = createStoreWithMiddleware(reducer, initialState);
  });

  describe('When: An action with analytics meta is dispatched', () => {

    beforeEach(() => store.dispatch({
      type: 'FOO',
      meta: {
        analytics: { type: 'some-event' }
      }
    }));

    it('Then: It should invoke the tracking callback with the meta as the first argument', () => {
      const [ meta ] = eventCallbackSpy.getCall(0).args;
      assert.deepEqual(meta, { type: 'some-event' });
    });

    it('Then: It should invoke the tracking callback with the analytics state as the second argument', () => {
      const [, analyticsState ] = eventCallbackSpy.getCall(0).args;
      assert.deepEqual(analyticsState, { abc: 123 });
    });

    it('Then: It should only invoke the tracking callback once', () => {
      assert.equal(eventCallbackSpy.callCount, 1);
    });

  });

  describe('When: An action with analytics meta is dispatched that updates state', () => {

    beforeEach(() => store.dispatch({
      type: 'ADD_SOMETHING',
      meta: {
        analytics: { type: 'foobar' }
      }
    }));

    it('Then: The new state should be available to the analytics middleware callback', () => {
      const [, analyticsState ] = eventCallbackSpy.getCall(0).args;
      assert.deepEqual(analyticsState, { abc: 123, 'added': true });
    });

  });

  describe('When: An action without meta is dispatched', () => {

    beforeEach(() => store.dispatch({
      type: 'FOO'
    }));

    it('Then: It should not invoke the tracking callback', () => {
      assert.equal(eventCallbackSpy.callCount, 0);
    });

  });

  describe('When: An action with meta is dispatched, but the meta does not contain an analytics object', () => {

    beforeEach(() => store.dispatch({
      type: 'FOO',
      meta: { type: 'foobar' }
    }));

    it('Then: It should not invoke the tracking callback', () => {
      assert.equal(eventCallbackSpy.callCount, 0);
    });

  });

  describe('When: An action with meta is dispatched, but the meta is not a Flux Standard Action', () => {

    beforeEach(() => store.dispatch({
      type: 'FOO',
      meta: {
        analytics: {
          not: 'a flux standard action'
        }
      }
    }));

    it('Then: It should not invoke the tracking callback', () => {
      assert.equal(eventCallbackSpy.callCount, 0);
    });

  });

});
