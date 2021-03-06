import { isUrl } from '../utils/utils';

const menuData = [{
  name: 'dashboard',
  icon: 'dashboard',
  path: 'dashboard',
  hideInMenu: true,
  children: [{
    name: '分析页',
    path: 'analysis',
    hideInMenu: true,
  }, {
    name: '监控页',
    path: 'monitor',
    hideInMenu: true,
  }, {
    name: '工作台',
    path: 'workplace',
  }],
}, {
  name: '赛区管理',
  icon: 'database',
  path: 'regions',
}, {
  name: '报名管理',
  icon: 'inbox',
  path: 'registrations',
}, {
  name: '大赛信息',
  icon: 'file-text',
  path: 'articles',
}, {
  name: '单位管理',
  icon: 'table',
  path: 'unit',
  children: [{
    name: '单位分组',
    path: 'unitGroups',
  }, {
    name: '单位',
    path: 'units',
  }],
}, {
  name: '导师管理',
  icon: 'contacts',
  path: 'tutor',
  children: [{
    name: '导师团',
    path: 'tutorGroups',
  }, {
    name: '导师',
    path: 'tutors',
  }],
}, {
  name: '投资人管理',
  icon: 'idcard',
  path: 'investors',
}, {
  name: '合作机构',
  icon: 'api',
  path: 'organizations',
}, {
  name: '参赛项目',
  icon: 'trophy',
  path: 'participants',
}, {
  name: '新闻管理',
  icon: 'file-text',
  path: 'news',
}, {
  name: '活动图片',
  icon: 'picture',
  path: 'albums',
}, {
  name: '横幅管理',
  icon: 'credit-card',
  path: 'banners',
}, {
  name: '使用文档',
  icon: 'book',
  path: 'http://pro.ant.design/docs/getting-started',
  target: '_blank',
  hideInMenu: true,
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
