import { Action, AnyAction } from 'redux';
import { Map } from 'immutable';
import { ReducersMapObject, LiftedLoopReducer, Loop } from 'redux-loop';

export function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): LiftedLoopReducer<Map<string, any>, A>;

export function mergeChildReducers<S>(
  parentResult: Map<string, any> | Loop<Map<string, any>>,
  action: AnyAction,
  childMap: ReducersMapObject<S>
): Loop<Map<string, any>>;

// eslint-disable-next-line camelcase
export function DEPRECATED_mergeChildReducers<S>(
  parentResult: Map<string, any> | Loop<Map<string, any>>,
  action: AnyAction,
  childMap: ReducersMapObject<S>
): Loop<Map<string, any>>;
