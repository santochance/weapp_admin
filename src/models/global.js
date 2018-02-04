import { queryNotices, querySortsTree } from '../services/api';


/*
  转换分类树以适配Tree组件
  label, value, key
 */
function transformTree(list) {
  list.map((item) => {
    // action
    const newItem = {
      ...item,
      label: item.title,
      value: item.id,
      key: item.id,
    };

    if (item.children && item.children.length > 0) {
      newItem.children = transformTree(item.children);
    }
    return newItem;
  });
  return list;
}

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *fetchSortsTree(_, { call, put }) {
      const response = yield call(querySortsTree);
      yield put({
        type: 'saveSortsTree',
        payload: transformTree(response.data),
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveSortsTree(state, { payload }) {
      return {
        ...state,
        sortsTree: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
