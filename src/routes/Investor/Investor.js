import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '投资人头像',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '投资人名称',
    dataIndex: 'title',
  },
  {
    title: '投资人头衔',
    dataIndex: 'subTitle',
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
    label: '投资人名称',
    name: 'title',
    rules: [{ required: true, message: '请填写投资人名称' }],
  }, {
    label: '投资人头衔',
    name: 'subTitle',
    rules: [{ required: true, message: '请填写投资人头衔' }],
  }, {
    label: '投资人头像',
    name: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为1 : 1, 建议尺寸为240 x 240',
    rules: [{ required: true, message: '请上传投资人头像' }],
  },
];

const qs = {};

export default class Investor extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
