import {loop, isLoop, getModel, getCmd, Cmd} from 'redux-loop';

/*
mergeChildReducers can be used to map child reducers to keys on a parent reducer.
this can be used to nest your reducers, better organize the state, and make 
reusable features with their own slices of state that can be placed on any page

example:
import childReducer from 'child'; 
import child2Reducer from 'child2'; 

function reducer(state, action){
  let result;
  switch(action.type){
    case 'add1':
      result = state.update('value', val => val + 1);
      break;
    case 'sideEffect'
      result = loop(state, Cmd.action(whatever));
      break;
    default:
      result = state;
      break;
  }
  return mergeChildStates(result, action, {
    child: childReducer //can be anything. result will be on state.child. Cmds will be run
    child2: child2Reducer,
    child3: null //child 3 will be removed from the state
  });
}

params:
parentResult is either the parent's new state or a loop containing the new state and a Cmd from the parent

action is the action

childMap is an object mapping key names on the parent state to a child reducer.
the values should be child reducers or null. null values will cause their keys to be removed from state
*/

export default function mergeChildReducers(parentResult, action, childMap){
  let initialState = parentResult, parentCmd;
  if(isLoop(initialState)){
    parentCmd = getCmd(initialState);
    initialState = getModel(initialState);
  }

  let keys = Object.keys(childMap);
  let cmds = parentCmd ? [parentCmd] : [];

  const newState = initialState.withMutations(state => {
    keys.forEach(key => {
      let childReducer = childMap[key];
      if(!childReducer){
        state.delete(key);
        return;
      }
      let currentChild = childReducer(state.get(key), action);
      if(isLoop(currentChild)){
        cmds.push(getCmd(currentChild));
        currentChild = getModel(currentChild);
      }
      state.set(key, currentChild);
    });
  });
  return loop(newState, getListCmdIfNeeded(cmds)); 
}

function getListCmdIfNeeded(cmds) {
  switch(cmds.length) {
    case 0:
      return Cmd.none;
    case 1:
      return cmds[0];
    default:
      return Cmd.list(cmds);
  }
}