import React, { PureComponent } from 'react';
import moment from 'moment';
import TableList from '../../components/TableList';
import styles from './TutorGroup.less';

const columns = [
  {
    title: '导师团名称',
    dataIndex: 'title',
    className: styles.colTitle,
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
    label: '导师团名称',
    name: 'title',
    dataIndex: 'title',
  }, {
    label: '描述',
    name: 'desc',
    dataIndex: 'desc',
    type: 'textarea',
  },
];

export default class TutorGroup extends PureComponent {
  render() {
    return (
      <TableList {...this.props} columns={columns} controls={controls} />
    );
  }
}
