import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '横幅图片',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '横幅名称',
    dataIndex: 'title',
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
    label: '横幅名称',
    name: 'title',
  }, {
    label: '横幅图片',
    name: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片宽度最少为750，高度不限',
    rules: [{ required: true, message: '请上传横幅图片' }],
  },
];

const qs = {};

export default class Banner extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
