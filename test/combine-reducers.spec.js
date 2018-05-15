import {fromJS} from 'immutable';
import combineReducers from '../src/combine-reducers';
import * as mergeChildReducers from '../src/merge-child-reducers';

let adder = (state = 0, {value}) => state + value;
let multiplier = (state = 1, {value}) => state * value;

describe('combineReducers', function(){
  beforeEach(function(){
    jest.spyOn(mergeChildReducers, 'default').mockImplementation((...args) => args);
  });

  it('returns a function that calls mergeChildReducers with the passed in state, action, and the original childMap', function(){
    let childMap = {adder, multiplier};
    let reducer = combineReducers(childMap);
    let state = fromJS({foo: 'bar'});
    let action = {type: 'foo'};
    let args = reducer(state, action);
    expect(args).toEqual([state, action, childMap]);
  });

  it('defaults to an empty Map for the state', function(){
    let childMap = {adder, multiplier};
    let reducer = combineReducers(childMap);
    let action = {type: 'foo'};
    let args = reducer(undefined, action);
    expect(args).toEqual([fromJS({}), action, childMap]);
  });

  it('passes extra params through to mergeChildReducers', function(){
    let childMap = {adder, multiplier};
    let reducer = combineReducers(childMap);
    let state = fromJS({foo: 'bar'});
    let action = {type: 'foo'};
    let args = reducer(state, action, 3, 4, 5);
    expect(args).toEqual([state, action, childMap, 3, 4, 5]);
  });
});