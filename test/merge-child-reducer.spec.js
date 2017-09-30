import {Map, fromJS, is} from 'immutable';
import {loop, Cmd} from 'redux-loop';
import mergeChildReducers from '../src/merge-child-reducers';

let adder = (state = 0, {value}) => state + value;
let multiplier = (state = 1, {value}) => state * value;
let adderCmd = (state = 0, {value}) => loop(state + value, Cmd.action({type: 'add'}));
let multiplierCmd = (state = 1, {value}) => loop(state * value, Cmd.action({type: 'multiply'}));

function foo(){}

export function compareLoops(loop1, loop2){
  expect(is(loop1[0], loop2[0])).toBe(true);
  expect(loop1[1]).toEqual(loop2[1]);
}

describe('mergeChildReducers', function(){
  it('runs each child reducer and merges it onto the parent result, and returns a loop with Cmd.none', function(){
    let state = fromJS({
      foo: 'bar',
      adder: 2,
      multiplier: 3
    });
    const result = mergeChildReducers(state, {type: 'foo', value: 5}, {adder, multiplier});
    let newState = fromJS({
      foo: 'bar',
      adder: 7,
      multiplier: 15
    });

    compareLoops(result, loop(newState, Cmd.none));
  });

  it('creates the child properties if they do not exist already (and runs them with undefined state)', function(){
    let state = fromJS({
      foo: 'bar'
    });
    const result = mergeChildReducers(state, {type: 'foo', value: 3}, {adder, multiplier});
    let newState = fromJS({
      foo: 'bar',
      adder: 3,
      multiplier: 3
    });
    compareLoops(result, loop(newState, Cmd.none));
  });

  it('runs cmd from the parent result if it is a loop', function(){
    const result = mergeChildReducers(loop(Map(), Cmd.run(foo)), {type: 'foo', value: 2}, {adder, multiplier});
    let newState = fromJS({
      adder: 2,
      multiplier: 2
    });
    compareLoops(result, loop(newState, Cmd.run(foo)));
  });

  it('combines parent and children cmds together in a list', function(){
    let map = {adderCmd, multiplierCmd};
    let state = fromJS({
      foo: 'bar',
      adderCmd: 3,
      multiplierCmd: 5
    });
    const result = mergeChildReducers(loop(state, Cmd.run(foo)), {type: 'foo', value: 10}, map);
    let newState = fromJS({
      foo: 'bar',
      adderCmd: 13,
      multiplierCmd: 50
    });
    let expectedCmds = [Cmd.run(foo), Cmd.action({type: 'add'}), Cmd.action({type: 'multiply'})];
    compareLoops(result, loop(newState, Cmd.list(expectedCmds)));
  });

  it('will not add a child cmd to a list if it is the only one', function(){
    let map = {adder, multiplierCmd};
    let state = fromJS({
      foo: 'bar',
      adder: 3,
      multiplierCmd: 5
    });
    const result = mergeChildReducers(state, {type: 'foo', value: 10}, map);
    let newState = fromJS({
      foo: 'bar',
      adder: 13,
      multiplierCmd: 50
    });
    compareLoops(result, loop(newState, Cmd.action({type: 'multiply'})));
  });

  it('removes slices of state that have null for their reducers in the map', function(){
    let state = fromJS({
      foo: 'bar',
      adder: 2,
      multiplier: 3
    });
    const result = mergeChildReducers(state, {type: 'foo', value: 5}, {adder: null, multiplier});
    let newState = fromJS({
      foo: 'bar',
      multiplier: 15
    });
    compareLoops(result, loop(newState, Cmd.none));
  });
});