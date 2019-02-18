/**
 * 使用saga进行流程处理；
 */

import {
  call,
  put,
  select,
  takeLatest,
  all,
} from 'redux-saga/effects';

import { Pattern } from 'redux-saga';
// eslint-disable-next-line no-unused-vars
import { FATCH_ACTION_SUCCESS_PREFIX, FATCH_ACTION_ERROR_PREFIX, CREATE } from 'utils/constants';
import { loadingDataError } from '../../state/actions';
import { getDataList, updateEntityModal, updateAuthModal } from './actions';
import { POST_CREATE_ENTITY, POST_EDIT_ENTITY } from './constants';
import { selectSearchCondition, selectPagination } from './selectors';

export function* createCreateSuccess() {
  try {
    yield put(updateEntityModal({
      type: CREATE,
      show: false,
      data: {},
    }));
    yield put(updateAuthModal({
      type: CREATE,
      show: true,
      data: [],
    }));
    const searchCondition = yield select(selectSearchCondition);
    const pagination = yield select(selectPagination);
    yield put(getDataList({
      ...searchCondition,
      page: pagination.current,
      perpage: pagination.pageSize,
    }));
  } catch (err) {
    yield put(loadingDataError(err));
  }
}

export function* createEditSuccess() {
  try {
    yield put(updateEntityModal({
      type: CREATE,
      show: false,
      data: {},
    }));
    const searchCondition = yield select(selectSearchCondition);
    const pagination = yield select(selectPagination);
    yield put(getDataList({
      ...searchCondition,
      page: pagination.current,
      perpage: pagination.pageSize,
    }));
  } catch (err) {
    yield put(loadingDataError(err));
  }
}

export function* watcher(type: Pattern, process: any) {
  yield takeLatest(type, process);
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  yield all([
    call(() => watcher(`${FATCH_ACTION_SUCCESS_PREFIX}${POST_CREATE_ENTITY}`, createCreateSuccess)),
    call(() => watcher(`${FATCH_ACTION_SUCCESS_PREFIX}${POST_EDIT_ENTITY}`, createEditSuccess)),
  ]);
}
