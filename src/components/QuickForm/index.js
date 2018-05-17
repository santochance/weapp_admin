import React from 'react';
import { Form, Input, TreeSelect } from 'antd';
import PicturesWall from '../../components/PicturesWall';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create({
  mapPropsToFields: (props) => {
    const { data, controls } = props;
    if (data) {
      return controls.reduce((obj, control) => {
        return Object.assign({}, obj, {
          [control.name]: Form.createFormField({
            value: typeof control.dataIndex === 'function'
              ? control.dataIndex(data)
              : data[control.dataIndex],
          }),
        });
      }, {});
    }
  },
  onValuesChange: (props, values) => {
    if (props.onValuesChange) {
      const key = Object.keys(values)[0];
      props.onValuesChange(key, values[key]);
    }
  },
})
export default class QuickForm extends React.Component {
  state = {}
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
          })(
            <TextArea placeholder={control.placeholder} />
          )}
        </FormItem>
      );
    } else if (control.type === 'select') {
      return (
        <FormItem {...formItemLayout} key={reactKey} label={control.label}>
          {getFieldDecorator(control.name)(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={control.treeData}
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
          })(
            <PicturesWall
              name={control.uploadField || 'pics'}
              action={control.action || 'https://vc-weapp.leanapp.cn/api/v1/upload'}
              limit={1}
            />
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
