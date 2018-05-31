import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '项目入口图',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '团队名称',
    dataIndex: 'title',
  },
  {
    title: '项目名称',
    dataIndex: 'project',
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
    label: '团队名称',
    name: 'title',
    rules: [{ required: true, message: '请填写团队名称' }],
  }, {
    label: '项目名称',
    name: 'project',
    rules: [{ required: true, message: '请填写项目名称' }],
  }, {
    label: '项目简介',
    name: 'desc',
    type: 'textarea',
  }, {
    label: '项目入口图',
    name: 'pic',
    dataIndex: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为1 : 1, 建议尺寸为240 x 240',
    rules: [{ required: true, message: '请上传项目项目入口图' }],
  }, {
    label: '项目详情',
    name: 'content',
    type: 'richtext',
  },
];

const qs = {};

export default class Participant extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
