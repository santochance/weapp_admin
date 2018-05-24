import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '新闻入口图',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '新闻标题',
    dataIndex: 'title',
  },
  {
    title: '发布时间',
    dataIndex: 'publishedAt',
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
    label: '新闻标题',
    name: 'title',
    rules: [{ required: true, message: '请填写新闻标题' }],
  }, {
    label: '新闻简介',
    name: 'desc',
    type: 'textarea',
  }, {
    label: '发布时间',
    name: 'publishedAt',
    type: 'date',
  }, {
    label: '新闻入口图',
    name: 'pic',
    dataIndex: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为3 : 2, 建议尺寸为720 x 480',
    rules: [{ required: true, message: '请上传新闻入口图' }],
  }, {
    label: '新闻内容',
    name: 'content',
    type: 'richtext',
  },
];

const qs = {};

export default class News extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
