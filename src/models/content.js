import { queryContent, removeContent, addContent } from '../services/api';

export default {
  namespace: 'content',

  state: {
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
      yield call(addContent, payload);
      const response = yield call(queryContent,
        { region: payload.region, sortName: payload.sortName });
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
      yield call(removeContent, payload);
      const response = yield call(queryContent,
        { region: payload.region, sortName: payload.sortName });
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
    save(state, { payload: { sortName, data } }) {
      return {
        ...state,
        [sortName]: data,
      };
    },
  },
};
