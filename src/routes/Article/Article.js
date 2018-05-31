import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '信息类型',
    dataIndex: 'kind',
    render: (val) => <span>{val === 'intro' ? '大赛简介' : val === 'flow' ? '大赛流程' : val}</span>,
  },
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '排序',
    dataIndex: 'order',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
];

const controls = [
  {
    label: '排序',
    name: 'order',
    initialValue: 10,
    type: 'number',
  }, {
    label: '信息类型',
    name: 'kind',
    type: 'select',
    treeData: [{
      label: '大赛简介',
      value: 'intro',
      key: 'intro',
    }, {
      label: '大赛流程',
      value: 'flow',
      key: 'flow',
    }],
    rules: [{ required: true, message: '请选择信息类型' }],
  }, {
    label: '标题',
    name: 'title',
    rules: [{ required: true, message: '请填写标题' }],
  }, {
    label: '内容',
    name: 'content',
    type: 'richtext',
  },
];

const qs = {};

export default class Article extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
