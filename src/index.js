import c from './combine-reducers';
import m, {
  DEPRECATED_mergeChildReducers as mergeChildReducersWithNoWarning,
} from './merge-child-reducers';

//by exporting functions, these are able to be spied on
export function combineReducers(...args) {
  return c(...args);
}
export function mergeChildReducers(...args) {
  return m(...args);
}
// eslint-disable-next-line camelcase
export function DEPRECATED_mergeChildReducers(...args) {
  return mergeChildReducersWithNoWarning(...args);
}
