import { routerRedux } from 'dva/router';
import { fakeAccountLogin, login } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      console.log('login/login effects response:', response);
      // Login successfully
      if (response.status === 'ok') {
        console.log('login successfully!');
        reloadAuthorized();
        console.log('authorized reloaded');
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        /*
          下面这部分是把当前路径信息设置到url的query string
          如果退出后又马上登录，可以使用这些信息redirect到退出前的页面
        */
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log('currentAuthority:', payload.currentAuthority);
      setAuthority(payload.currentAuthority || 'user');
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
