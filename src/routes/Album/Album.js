import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '相册入口图',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '相册标题',
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
  }, {
    label: '相册标题',
    name: 'title',
    rules: [{ required: true, message: '请填写相册标题' }],
  }, {
    label: '相册入口图',
    name: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为3 : 2, 建议尺寸为720 x 480',
    rules: [{ required: true, message: '请上传相册入口图' }],
  }, {
    label: '相册图片',
    name: 'photos',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为3 : 2, 建议尺寸为720 x 480',
  },
];

export default class Album extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} />
    );
  }
}
