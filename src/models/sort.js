import { queryContent, removeContent, addContent } from '../services/api';

/* 由列表数据生成树数据 */
function generateTreeData(_list) {
  /* 注意使用深拷贝，防止修改源数据 */
  const list = JSON.parse(JSON.stringify(_list));
  if (!(list.length > 0)) return [];
  for (let i = 0; i < list.length; i += 1) {
    const arr = [];
    for (let j = 0; j < list.length; j += 1) {
      if (list[i].id === list[j].pid) {
        list[i].children = arr;
        arr.push(list[j]);
      }
    }
  }

  const treeData = [];
  for (let i = 0; i < list.length; i += 1) {
    if (!list[i].pid) {
      treeData.push(list[i]);
    }
  }
  console.log('gen treeData:', treeData);
  return treeData;
}

/*
  转换分类树以适配Tree组件, Table组件
  label, value, key
 */
function transformTree(list) {
  return list.map((item) => {
    // action
    const newItem = {
      ...item,
      label: item.title,
      value: String(item.id),
      key: String(item.id),
    };

    if (item.children && item.children.length > 0) {
      newItem.children = transformTree(item.children);
    }
    return newItem;
  });
}

export default {
  namespace: 'sort',

  state: {
    data: {
      data: [],
      list: [],
      pagination: {},
      treeData: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log('sort/fetch payload:', payload);
      const response = yield call(queryContent, payload);
      console.log('sort/fetch response:', response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      console.log('sort/add payload:', payload);
      const response = yield call(addContent, payload);
      console.log('sort/add response:', response);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeContent, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      console.log('sort save reducers payload:', payload);
      const treeData = transformTree(generateTreeData(payload.data));
      return {
        ...state,
        data: {
          ...payload,
          list: payload.data,
          data: treeData,
          treeData,
        },
      };
    },
  },
};
