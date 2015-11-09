[![Build Status](https://img.shields.io/travis/markdalgleish/redux-analytics/master.svg?style=flat-square)](http://travis-ci.org/markdalgleish/redux-analytics) [![npm](https://img.shields.io/npm/v/redux-analytics.svg?style=flat-square)](https://www.npmjs.com/package/redux-analytics)

# redux-analytics

Analytics middleware for [Redux](https://github.com/rackt/redux).

```bash
$ npm install --save redux-analytics
```

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

## Thanks

[@pavelvolek](https://github.com/pavelvolek) and [@arturmuller](https://github.com/arturmuller) for providing the initial inspiration with [redux-keen](https://github.com/pavelvolek/redux-keen).

## License

[MIT License](http://markdalgleish.mit-license.org/)
