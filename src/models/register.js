import { fakeRegister, register } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    user: {},
  },

  effects: {
    *submit({ payload }, { call, put }) {
      console.log('call submit effects with payload:', payload);

      const response = yield call(register, payload);

      console.log('submit effects response:', response);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        // status: payload.status,
        user: payload.user,
      };
    },
  },
};
