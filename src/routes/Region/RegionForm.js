import React from 'react';
import { Form, Input } from 'antd';
import PicturesWall from '../../components/PicturesWall';

const { TextArea } = Input;
const FormItem = Form.Item;

/* UploadList组件要求传入的fileList满足`[{ url:String, uid: String }]`结构 */
function picFieldAdapter(pics) {
  const rst = Array.isArray(pics) ? pics : [pics];
  if (typeof rst[0] !== 'object') {
    // 假设图片项是string
    return rst.map((url, idx) => ({
      url,
      uid: `${Date.now() + idx}`,
    }));
  }
  return rst;
}

@Form.create({
  mapPropsToFields: (props) => {
    const { data } = props;
    if (data) {
      return {
        order: Form.createFormField({ value: data.order }),
        title: Form.createFormField({ value: data.title }),
        city: Form.createFormField({ value: data.city }),
        pic: Form.createFormField({ value: picFieldAdapter(data.pic) }),
        desc: Form.createFormField({ value: data.desc }),
      };
    }
  },
  onValuesChange: (props, values) => {
    if (props.onValuesChange) {
      const key = Object.keys(values)[0];
      props.onValuesChange(key, values[key]);
    }
  },
})
export default class RegionForm extends React.Component {
  state = {}
  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
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

    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        <FormItem {...formItemLayout} label="排序">
          {getFieldDecorator('order', {
            initialValue: 10,
          })(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="标题">
          {getFieldDecorator('title', {})(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所在城市">
          {getFieldDecorator('city', {})(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="图片">
          {getFieldDecorator('pic', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <PicturesWall
              name="pics"
              action="https://vc-weapp.leanapp.cn/api/v1/upload"
              limit={1}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="简介">
          {getFieldDecorator('desc', {})(
            <TextArea placeholder="" />
          )}
        </FormItem>
      </Form>
    );
  }
}
