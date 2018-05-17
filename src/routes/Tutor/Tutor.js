import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';
import styles from './Tutor.less';

const columns = [
  {
    title: '导师名称',
    dataIndex: 'title',
    className: styles.colTitle,
  },
  {
    title: '导师团',
    dataIndex: 'sort',
    render: (text, record) => <a href={record.slink}>{record.sname || text}</a>,
  },
  {
    title: '描述',
    dataIndex: 'desc',
    className: styles.colDesc,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    className: styles.colUpdatedAt,
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
    dataIndex: ({ tutorGroup }) => (typeof tutorGroup === 'string' ? tutorGroup : tutorGroup.objectId),
    type: 'select',
    treeData: [],
    source: '/tutorGroups',
  }, {
    label: '导师名称',
    name: 'title',
    dataIndex: 'title',
  }, {
    label: '描述',
    name: 'desc',
    dataIndex: 'desc',
    type: 'textarea',
  }, {
    label: '头像',
    name: 'pic',
    dataIndex: 'pic',
    type: 'upload',
    uploadField: '',
    action: '',
  },
];

export default class Tutor extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} />
    );
  }
}
