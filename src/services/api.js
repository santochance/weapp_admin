import { stringify } from 'qs';
import request from '../utils/request';

export async function querySortsTree() {
  return request('/sorts/tree', { forwards: true });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryContent({ region, sortName, objectId, qs = {} }) {
  let endpoint = `/${sortName}`;
  const queryStr = stringify({
    region: region.objectId || region,
    ...qs,
  });
  if (objectId) {
    endpoint += `/${objectId}`;
  }
  if (queryStr) {
    endpoint += `?${queryStr}`;
  }
  console.log('# queryContent request', endpoint);
  return request(endpoint, { forwards: true });
}

export async function removeContent({ region, sortName, objectId }) {
  const endpoint = `/${sortName}`;
  console.log('# removeContent request', endpoint);
  return request(`${endpoint}/${objectId}`, {
    forwards: true,
    method: 'DELETE',
  });
}

export async function addContent({ region, sortName, objectId, entry }) {
  const method = objectId ? 'PATCH' : 'POST';
  let endpoint = `/${sortName}`;
  if (objectId) {
    endpoint += `/${objectId}`;
  }
  return request(endpoint, {
    forwards: true,
    method,
    body: {
      ...entry,
      region,
    },
  });
}

export async function queryRegion() {
  const endpoint = '/regions';
  return request(endpoint, { forwards: true });
}

export async function removeRegion({ objectId = '' }) {
  const endpoint = '/regions';
  return request(`${endpoint}/${objectId}?query`, {
    forwards: true,
    method: 'DELETE',
  });
}

export async function addRegion({ objectId = '', entry }) {
  const method = objectId ? 'PATCH' : 'POST';
  let endpoint = '/regions';
  if (objectId) {
    endpoint += `/${objectId}`;
  }
  return request(endpoint, {
    forwards: true,
    method,
    body: {
      ...entry,
    },
  });
}

export async function queryRule() {
  // return request(`/api/rule?${stringify(params)}`);
  return request('/tutors', { forwards: true });
}

export async function removeRule(params) {
  return request(`/tutors/${params.objectId}?query`, {
    method: 'DELETE',
    forwards: true,
  });
}

export async function addRule(params) {
  console.log('addRule params:', params);
  let url = '/tutors';
  let method = 'POST';
  if (params.objectId) {
    method = 'PATCH';
    url += `/${params.objectId}`;
  }
  url += '?query';
  console.log('request /%s %s', method, url);
  return request(url, {
    forwards: true,
    method,
    body: {
      ...params.entry,
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/user/signup', {
    forwards: true,
    method: 'POST',
    body: params,
  });
}

export async function login(params) {
  return request('/user/login', {
    forwards: true,
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
