import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import TableList from '../../components/TableList';
import styles from './Tutor.less';

const columns = [
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
    render: (text, record) => <Link to="/tutor/tutorGroups">{record.tutorGroup.title}</Link>,
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
    dataIndex: 'order',
    initialValue: 10,
  }, {
    label: '导师团',
    name: 'tutorGroup',
    dataIndex: ({ tutorGroup }) => (typeof tutorGroup === 'object' ? tutorGroup.objectId : tutorGroup),
    type: 'select',
    source: '/tutorGroups',
    rules: [
      {
        required: true,
        message: '请选择导师团',
      },
    ],
  }, {
    label: '导师名称',
    name: 'title',
    dataIndex: 'title',
    rules: [
      {
        required: true,
        message: '请填写导师名称',
      },
    ],
  }, {
    label: '导师头衔',
    name: 'subTitle',
    dataIndex: 'subTitle',
    rules: [
      {
        required: true,
        message: '请填写导师头衔',
      },
    ],
  }, {
    label: '头像',
    name: 'pic',
    dataIndex: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    uploadField: '',
    action: '',
    rules: [
      {
        required: true,
        message: '请上传头像',
      },
    ],
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
