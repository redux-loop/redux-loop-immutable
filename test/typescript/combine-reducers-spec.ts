import { LoopReducer, getModel } from 'redux-loop';
import { Map } from 'immutable';
import { combineReducers } from '../../index';

const fooState = Map({ foo: 123 });

const fooReducer: LoopReducer<Map<string, unknown>> = (state = fooState) => {
  return state;
};

const barState = Map({ bar: 123 });

const barReducer: LoopReducer<Map<string, unknown>> = (state = barState) => {
  return state;
};

const rootReducer = combineReducers({
  foo: fooReducer,
  bar: barReducer,
});

const res = rootReducer(undefined, {
  type: 'blah',
  text: 'test',
});

getModel(res).get('foo');
