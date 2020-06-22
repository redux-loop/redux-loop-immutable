import { Map } from 'immutable';
import { loop, isLoop, getModel, getCmd, Cmd } from 'redux-loop';

//a helper to merge a bunch of reducers together with no shared root state
//simpler version of mergeChildReducers for when the parent does nothing (like app root)

export default function combineReducers(childMap) {
  return (rootState = Map(), action, ...args) => {
    let keys = Object.keys(childMap);
    let cmds = [];

    const newState = rootState.withMutations((state) => {
      keys.forEach((key) => {
        let childReducer = childMap[key];
        if (!childReducer) {
          state.delete(key);
          return;
        }
        let currentChild = childReducer(state.get(key), action, ...args);
        if (isLoop(currentChild)) {
          cmds.push(getCmd(currentChild));
          currentChild = getModel(currentChild);
        }
        state.set(key, currentChild);
      });
    });
    return loop(newState, getListCmdIfNeeded(cmds));
  };
}

function getListCmdIfNeeded(cmds) {
  switch (cmds.length) {
    case 0:
      return Cmd.none;
    case 1:
      return cmds[0];
    default:
      return Cmd.list(cmds);
  }
}
