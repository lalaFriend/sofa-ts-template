import * as invariant from 'invariant';
import { isEmpty, isFunction, isString } from 'lodash';

import checkStore from './checkStore';
import createReducer from '../state/reducers';
import { SofaAction } from '../types';

export function injectReducerFactory(store: any, isVaild: boolean) {
  return function injectReducer(key: string, reducer: (state: any, action: SofaAction) => any) {
    if (!isVaild) checkStore(store);

    invariant(
      isString(key) && !isEmpty(key) && isFunction(reducer),
      'injectReducer: Expected `reducer` to be a reducer function',
    );

    if (Reflect.has(store.injectedReducers, key) && store.injectedReducers[key] === reducer) return;

    // eslint-disable-next-line
    store.injectedReducers[key] = reducer;
    store.replaceReducer(createReducer(store.injectedReducers));
  };
}

export default function getInjectors(store: any) {
  checkStore(store);

  return {
    injectReducer: injectReducerFactory(store, true),
  };
}
