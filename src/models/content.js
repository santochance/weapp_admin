import { queryContent, removeContent, addContent } from '../services/api';

export default {
  namespace: 'content',

  state: {
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log('call content/fetch');
      const response = yield call(queryContent, payload);
      console.log('response of content/fetch', response);
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
      console.log('response of content/remove', response);
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
    save(state, { payload: { sortName, data }}) {
      return {
        ...state,
        [sortName]: data,
      };
    },
  },
};
