# redux-loop-immutable

ImmutableJS helpers for use with [Redux Loop](https://github.com/redux-loop/redux-loop)

## Installation

React Loop Immutable requires redux-loop 4.1.0 or higher

```
npm install --save redux-loop-immutable
```

## API

### `combineReducers(reducersMap)`

This is simply an ImmutableJS-optimized version of the `combineReducers` provided by core redux-loop.
Instead of the default state being a plain object, it is an Immutable.Map instance.

#### Arguments
* `reducersMap: Object<string, ReducerFunction>` &ndash; a plain object map of keys to nested
  reducers, just like the `combineReducers` you would find in Redux itself.

#### Examples
```js
import { combineReducers } from 'redux-loop-immutable';
import reducerWithSideEffects from './reducer-with-side-effects';
import plainReducer from './plain-reducer';

export default combineReducers({
  withEffects: reducerWithSideEffects,
  plain: plainReducer
});
```

### `mergeChildReducers(parentResult, action, childMap)`

This is an ImmutableJS-optimized version of the `mergeChildRedcuers` provided by core redux-loop.
Like that version of `mergeChildReducers`, it is a more generalized version of `combineReducers` that allows
you to nest reducers underneath a common parent that has functionality of its own (rather than restricting the parent to simply 
passing actions to its children like `combineReducers` does)

* `parentResult: Immutable.Map | loop(Immutable.Map, Cmd)` &ndash; The result from the parent reducer before any child results have been applied.
* `action: Action` &ndash; a redux action
* `childMap: Object<string, ReducerFunction>` &ndash; a plain object map of keys to nested
  reducers, similar to the map in combineReducers. However, a key can be given a value of null to have it removed from the state.

#### Examples
```js
import { mergeChildReducers } from 'redux-loop-immutable';
import {getModel, isLoop} from 'redux-loop';
import reducerWithSideEffects from './reducer-with-side-effects';
import plainReducer from './plain-reducer';
import { fromJS } from 'immutable'
import pageReducerMap from '.page-reducers';

const initialState = fromJS({
   location: 'index'
});

function parentReducer(state = initialState, action){
  if(action.type !== 'LOCATION_CHANGE')
     return state;
     
  return state.set('location', action.newLocation);
}

export default function reducer(state, action){
  const parentResult = parentReducer(state, action);
  const location = (isLoop(parentResult) ? getModel(parentResult) : result).get('location');
  return mergeChildReducers(parentReducer(parentResult, action, {
     data: pageReducerMap[location]
  });
}

```

## Support

Potential bugs, generally discussion, and proposals or RFCs should be submitted
as issues to this repo, we'll do our best to address them quickly. We use this
library as well and want it to be the best it can! For questions about using the
library, [submit questions on StackOverflow](http://stackoverflow.com/questions/ask)
with the [`redux-loop` tag](http://stackoverflow.com/questions/tagged/redux-loop-immutable).

## Contributing

Please note that th

Notis project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms. Multiple language translations are available at [contributor-covenant.org](http://contributor-covenant.org/version/1/3/0/i18n/)
