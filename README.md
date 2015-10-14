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

Note that the `analytics` metadata must also be a [Flux Standard Action](https://github.com/acdlite/flux-standard-action).

Then, write the middleware to handle the presence of this metadata:

```js
import analytics from 'redux-analytics';
import track from 'my-awesome-analytics-library';

const middleware = analytics({ type, payload } => track(type, payload));
```

If you need to expose shared analytics data to multiple events, the `analytics` property of your state tree is provided as the second argument.

```js
import analytics from 'redux-analytics';
import track from 'my-awesome-analytics-library';

const middleware = analytics({ type, payload }, shared => {
  track(type, { ...shared, ...payload });
});
```

In order to streamline the management of the shared `analytics` data, it's recommended that you write a dedicated analytics reducer with the help of the [combineReducers](https://rackt.github.io/redux/docs/api/combineReducers.html) function.

## License

[MIT License](http://markdalgleish.mit-license.org/)
