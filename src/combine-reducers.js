import {Map} from 'immutable';
import mergeChildReducers from './merge-child-reducers';

//a helper to merge a bunch of reducers together with no shared root state
//simpler version of mergeChildReducers for when the parent does nothing (like app root)

export default function combineReducers(childMap){
  return (rootState = Map(), action) => {
    return mergeChildReducers(rootState, action, childMap);
  };
}
