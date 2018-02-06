import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  console.log('request queryCurrent User');
  return request('/auth/currentUser', { forwards: true });
}
