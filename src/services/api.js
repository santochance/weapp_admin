import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule() {
  // return request(`/api/rule?${stringify(params)}`);
  return request('/tutors', { forwards: true });
}

export async function removeRule(params) {
  return request(`/tutors/${params.objectId}?query`, {
    method: 'DELETE',
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

export async function queryNotices() {
  return request('/api/notices');
}
