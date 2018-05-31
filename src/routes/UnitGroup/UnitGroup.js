import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '分组名称',
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
    label: '分组名称',
    name: 'title',
    rules: [{ required: true, message: '请填写单位分组名称' }],
  },
];

const qs = {};

export default class UnitGroup extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
