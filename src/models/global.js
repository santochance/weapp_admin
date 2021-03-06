import { queryNotices, querySortsTree } from '../services/api';


/*
  转换分类树以适配Tree组件
  label, value, key
 */
function transformTree(list) {
  return list.map((item) => {
    // action
    const newItem = {
      ...item,
      label: item.title,
      value: String(item.objectId),
      key: String(item.objectId),
    };

    if (item.children && item.children.length > 0) {
      newItem.children = transformTree(item.children);
    }
    return newItem;
  });
}

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    sortsTree: [],
    sortsList: [],
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
        payload: { tree: transformTree(response.data), list: response.list },
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
        sortsTree: payload.tree,
        sortsList: payload.list,
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
