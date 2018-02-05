import { queryContent, removeContent, addContent } from '../services/api';

export default {
  namespace: 'content',

  state: {
    tutors: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryContent, payload);
      yield put({
        type: 'save',
        payload: {
          sortName: payload.sortName,
          data: response,
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addContent, payload);
      yield put({
        type: 'save',
        payload: {
          sortName: payload.sortName,
          data: response,
        },
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeContent, payload);
      yield put({
        type: 'save',
        payload: {
          sortName: payload.sortName,
          data: response,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        [sortName]: action.data,
      };
    },
  },
};
