import { routerRedux } from 'dva/router';
import { query as queryUsers, queryCurrent } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(queryCurrent);
      console.log('fetch current user response:', response);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (!response.user) {
        console.log('当前无用户，重写向到登录页');
        yield put(routerRedux.push('/user/login'));
      } else {
        /*
          如果使用下面语句跳转到'/', 可能会导致
            组件多出一次额外的mount和unmount

         比如通过'/#/regions'打开页面, 假设页面组件是Region, 内部流程是:
            Region mounted
            获取currentUser成功, 重写向到'/'
            Region unmounted
            假设'/'会自动重定向到'/#/regions'
            Region mounted
            ...
        */

        // yield put(routerRedux.push('/'));
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.user || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
