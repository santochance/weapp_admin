import React from 'react';
import { Form, Input, InputNumber, TreeSelect, DatePicker, Switch } from 'antd';
import moment from 'moment';
import PicturesWall from '../../components/PicturesWall';
import MyEditor from '../../components/MyEditor';
import picFieldAdapter from '../../utils/picFieldAdapter';
import request from '../../utils/request';
import config from '../../config';


const { TextArea } = Input;
const FormItem = Form.Item;

/* 由列表数据生成树数据 */
function generateTreeData(_list) {
  /* 注意使用深拷贝，防止修改源数据 */
  const list = JSON.parse(JSON.stringify(_list));
  if (!(list.length > 0)) return [];
  for (let i = 0; i < list.length; i += 1) {
    const arr = [];
    for (let j = 0; j < list.length; j += 1) {
      if (list[i].objectId === list[j].parent) {
        list[i].children = arr;
        arr.push(list[j]);
      }
    }
  }

  const treeData = [];
  for (let i = 0; i < list.length; i += 1) {
    /* 这里条件是分类作为顶级分类时parent要满足的条件 */
    if (list[i].parent === 'root' || !list[i].parent) {
      treeData.push(list[i]);
    }
  }
  return treeData;
}

/*
  转换分类树以适配Tree组件, Table组件
  label, value, key
 */
function transformTree(list) {
  return list.map((item) => {
    // action
    const newItem = {
      label: item.title,
      value: String(item.objectId),
      key: String(item.objectId),
      item,
    };

    if (item.children && item.children.length > 0) {
      newItem.children = transformTree(item.children);
    }
    return newItem;
  });
}

@Form.create({
  mapPropsToFields: (props) => {
    const { data, controls } = props;
    if (data) {
      return controls.reduce((obj, control) => {
        const { dataIndex } = control;
        let value = typeof dataIndex === 'function'
          ? dataIndex(data)
          : dataIndex
            ? data[dataIndex]
            : data[control.name];
        if (control.type === 'upload') {
          value = picFieldAdapter(value);
        }
        if (control.type === 'date') {
          value = value ? moment(value) : value;
        }
        return Object.assign({}, obj, {
          [control.name]: Form.createFormField({ value }),
        });
      }, {});
    }
  },
})
export default class QuickForm extends React.Component {
  state = {
    treeDataDict: {},
  }

  componentDidMount() {
    const { controls, region } = this.props;
    const { treeDataDict } = this.state;

    const setTreeDataDict = (key, data) => {
      this.setState({
        treeDataDict: {
          ...treeDataDict,
          [key]: data,
        },
      });
    };
    // 遍历controls进行预处理
    controls.forEach((control) => {
      // select类型如果有source属性，远程请求数据
      if (control.type === 'select') {
        if (control.source) {
          const sourceUrl = `${control.source}?region=${region.objectId}`;
          request(sourceUrl).then((res) => {
            setTreeDataDict(control.name, transformTree(generateTreeData(res.data)));
          });
        } else {
          setTreeDataDict(control.name, control.treeData);
        }
      }
    });
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  makeControl(control, reactKey) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    if (!control.type || control.type === 'text') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
            initialValue: control.initialValue,
            rules: control.rules,
          })(
            <Input placeholder={control.placeholder} />
          )}
        </FormItem>
      );
    } else if (control.type === 'textarea') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
            initialValue: control.initialValue,
            rules: control.rules,
          })(
            <TextArea placeholder={control.placeholder} />
          )}
        </FormItem>
      );
    } else if (control.type === 'number') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
            initialValue: control.initialValue,
            rules: control.rules,
          })(
            <InputNumber placeholder={control.placeholder} />
          )}
        </FormItem>
      );
    } else if (control.type === 'select') {
      const treeData = this.state.treeDataDict[control.name];
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
            rules: control.rules,
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              placeholder={control.placeholder || '请选择'}
              treeDefaultExpandAll
            />
          )}
        </FormItem>
      );
    } else if (control.type === 'upload') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            rules: control.rules,
          })(
            <PicturesWall
              name={control.uploadField || 'pics'}
              action={control.action || config.host + '/upload'}
              limit={typeof control.limit === 'number' ? control.limit : 1}
              remarks={control.remarks}
            />
          )}
        </FormItem>
      );
    } else if (control.type === 'richtext') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
          })(
            <MyEditor ueditorPath="/vendor/ueditor" />
          )}
        </FormItem>
      );
    } else if (control.type === 'date') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
          })(
            <DatePicker />
          )}
        </FormItem>
      );
    } else if (control.type === 'switch') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name, {
            valuePropName: 'checked',
          })(
            <Switch />
          )}
        </FormItem>
      );
    }
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { controls } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        {controls.map((control, idx) => this.makeControl(control, idx))}
      </Form>
    );
  }
}
