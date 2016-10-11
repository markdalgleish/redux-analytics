[![Build Status](https://img.shields.io/travis/markdalgleish/redux-analytics/master.svg?style=flat-square)](http://travis-ci.org/markdalgleish/redux-analytics) [![Coverage Status](https://img.shields.io/coveralls/markdalgleish/redux-analytics/master.svg?style=flat-square)](https://coveralls.io/r/markdalgleish/redux-analytics) [![npm](https://img.shields.io/npm/v/redux-analytics.svg?style=flat-square)](https://www.npmjs.com/package/redux-analytics)

# redux-analytics

Analytics middleware for [Redux](https://github.com/rackt/redux).

```bash
$ npm install --save redux-analytics
```

Want to customise your metadata further? Check out [redux-tap](https://github.com/markdalgleish/redux-tap).

## Usage

First, add some `analytics` metadata to your actions using the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) pattern:

```js
const action = {
  type: 'MY_ACTION',
  meta: {
    analytics: {
      type: 'my-analytics-event',
      payload: {
        some: 'data',
        more: 'stuff'
      }
    }
  }
};

const actionWithMultipleEvents = {
  type: 'MY_ACTION',
  meta: {
    analytics: [
      {
        type: 'my-analytics-event',
        payload: {
          some: 'data',
          more: 'stuff'
        }
      },
      {
        type: 'my-another-analytics-event',
        payload: {
          some: 'more-data',
          more: 'other-stuff'
        }
      }
    ]
  }
};
```

Note that the `analytics` metadata must also be a [Flux Standard Action](https://github.com/acdlite/flux-standard-action). If this isn't the case, an error will be printed to the console.

Then, write the middleware to handle the presence of this metadata:

```js
import analytics from 'redux-analytics';
import track from 'my-awesome-analytics-library';

const middleware = analytics(({ type, payload }) => track(type, payload));
```

If you need to expose shared analytics data to multiple events, your entire state tree is provided as the second argument.

```js
import analytics from 'redux-analytics';
import track from 'my-awesome-analytics-library';

const middleware = analytics(({ type, payload }, state) => {
  track(type, { ...state.analytics, ...payload });
});
```

If you'd like to use a different meta property than `analytics`, a custom selector function can be provided as the second argument.

The selector function is only invoked if the action has a `meta` property, and is provided the entire action as an argument. If the selector returns a falsy value, it will be ignored.

```js
// Given the following middleware configuration:
const select = ({ meta }) => meta.foobar;
const middleware = analytics(({ type, payload }) => track(type, payload), select);

// You can then format a trackable action like this:
const action = {
  type: 'MY_ACTION',
  meta: {
    foobar: {
      type: 'my-analytics-event'
    }
  }
};
```

## Thanks

[@pavelvolek](https://github.com/pavelvolek) and [@arturmuller](https://github.com/arturmuller) for providing the initial inspiration with [redux-keen](https://github.com/pavelvolek/redux-keen).

## License

[MIT License](http://markdalgleish.mit-license.org/)
