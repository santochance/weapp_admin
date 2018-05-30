import React, { PureComponent } from 'react';
import RegionList from './RegionList';

const controls = [
  {
    label: '排序',
    name: 'order',
    initialValue: 10,
  }, {
    label: '标题',
    name: 'title',
    rules: [{ required: true, message: '请填写标题' }],
  }, {
    label: '所在城市',
    name: 'city',
    rules: [{ required: true, message: '请填写标题' }],
  }, {
    label: '举办时间',
    name: 'hostedAt',
    rules: [{ required: true, message: '请填写举办时间' }],
  }, {
    label: '赛区主图',
    name: 'pic',
    outputTransform: pics => pics[0],
    type: 'upload',
    remarks: '图片比例为8 : 5, 建议尺寸为640 x 400',
    rules: [{ required: true, message: '请上传赛区主图' }],
  },
];

const qs = {};

export default class Region extends PureComponent {
  render() {
    return (
      <RegionList {...this.props} controls={controls} qs={qs} />
    );
  }
}
