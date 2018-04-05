import { queryRegion, removeRegion, addRegion } from '../services/api';


const seed = [{
  objectId: '1',
  title: '福田之星',
  pic: 'https://picsum.photos/300/200',
  desc: '2017年福田之星',
  hostedAt: '2018-04-05T11:04:02.214Z',
  city: '深圳市',
  order: 10,
}, {
  objectId: '1',
  title: '龙华之星',
  pic: 'https://picsum.photos/300/200',
  desc: '2017年龙华之星',
  hostedAt: '2018-03-05T11:04:02.214Z',
  city: '深圳市',
  order: 10,
}];

function repeat(list, num) {
  let n = typeof num === 'number' ? num : 1;
  let rst = list;
  while (n -= 1) {
    rst = rst.concat([...list]);
  }
  return rst;
}
const mockFecthRes = {
  list: repeat(seed, 6),
};

export default {
  namespace: 'region',

  state: {
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = mockFecthRes;
      console.log('response', JSON.stringify(response));
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRegion, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRegion, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchCurrent({ callback }, { select }) {
      // 从state中读取currentRegion
      let region = yield select(state => state.currentRegion);
      if (!region) {
        region = JSON.parse(window.localStorage.getItem('weapp-region'));
      }
      if (callback) callback(region);
    },
    *saveCurrent({ payload }, { put }) {
      // 使用localStorage做持久化存储
      window.localStorage.setItem('weapp-region', JSON.stringify(payload));
      yield put({
        type: 'saveCurrentRegion',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.list,
      };
    },
    saveCurrentRegion(state, action) {
      return {
        ...state,
        currentRegion: action.payload || '',
      };
    },
  },
};
