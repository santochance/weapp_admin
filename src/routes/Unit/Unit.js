import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '单位logo',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '单位名称',
    dataIndex: 'title',
  },
  {
    title: '单位分组',
    dataIndex: 'unitGroup',
    render: (text, record) => <Link to="/unit/unitGroup">{record.unitGroup && record.unitGroup.title}</Link>,
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
  }, {
    label: '单位名称',
    name: 'title',
    rules: [{ required: true, message: '请填写单位名称' }],
  }, {
    label: '单位logo',
    name: 'pic',
    dataIndex: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为15 : 7, 建议尺寸为150 x 70',
    rules: [{ required: true, message: '请上传单位logo' }],
  },
];

export default class Unit extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} />
    );
  }
}
