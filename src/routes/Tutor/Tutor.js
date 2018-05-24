import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import TableList from '../../components/TableList';

const columns = [
  {
    title: '导师头像',
    dataIndex: 'pic',
    render: (text, record) => <img src={typeof record.pic === 'object' ? record.pic.url : record.pic} alt={record.title} style={{ height: 50 }} />,
  },
  {
    title: '导师名称',
    dataIndex: 'title',
  },
  {
    title: '导师头衔',
    dataIndex: 'subTitle',
  },
  {
    title: '导师团',
    dataIndex: 'tutorGroup',
    render: (text, record) => <Link to="/tutor/tutorGroups">{record.tutorGroup && record.tutorGroup.title}</Link>,
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
    label: '导师团',
    name: 'tutorGroup',
    dataIndex: ({ tutorGroup }) => (typeof tutorGroup === 'object' ? tutorGroup.objectId : tutorGroup),
    type: 'select',
    source: '/tutorGroups',
    rules: [{ required: true, message: '请选择导师团' }],
  }, {
    label: '导师名称',
    name: 'title',
    rules: [{ required: true, message: '请填写导师名称' }],
  }, {
    label: '导师头衔',
    name: 'subTitle',
    rules: [{ required: true, message: '请填写导师头衔' }],
  }, {
    label: '头像',
    name: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为1 : 1, 建议尺寸为240 x 240',
    rules: [{ required: true, message: '请上传导师头像' }],
  },
];

const qs = {
  include: 'tutorGroup',
};

export default class Tutor extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} qs={qs} />
    );
  }
}
