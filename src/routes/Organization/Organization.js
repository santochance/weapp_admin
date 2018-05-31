import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '机构logo',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '机构名称',
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
    label: '机构名称',
    name: 'title',
    rules: [{ required: true, message: '请填写机构名称' }],
  }, {
    label: '机构logo',
    name: 'pic',
    dataIndex: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为15 : 7, 建议尺寸为150 x 70',
    rules: [{ required: true, message: '请上传机构logo' }],
  },
];

const qs = {};

export default class Organization extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
