import c from './combine-reducers';
import m from './merge-child-reducers';

//by exporting functions, these are able to be spied on
export function combineReducers(...args){return c(...args);}
export function mergeChildReducers(...args){return m(...args);}