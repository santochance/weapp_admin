import React, { PureComponent } from 'react';
import { Form, Input, Alert } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class DelPrompt extends PureComponent {
  state = {}

  onSubmit = () => {
    const { form, data, onSubmit = () => {} } = this.props;
    form.validateFields((err) => {
      if (!err) {
        onSubmit(data);
      }
    });
  }

  onCancel = () => {
    const { onCancel = () => {} } = this.props;
    onCancel();
  }

  render() {
    const { form: { getFieldDecorator }, data } = this.props;

    if (!data) return null;

    return (
      <Form>
        <Alert
          type="error"
          message={<div>正在准备删除<b>{data.title}</b></div>}
          description={
            <div><br />
              <p>注意！删除赛区后，与赛区相关的其他所有已录入的数据将无法使用！</p>
              <p>如果确实要执行删除操作，请在下面输入赛区的名称，然后点击“删除”。</p>
            </div>
          }
        />
        <FormItem>
          {getFieldDecorator('title', {
            rules: [{
              required: true,
              message: '请输入要删除的赛区名称（标题粗体字部分）',
            }, {
              pattern: new RegExp(data.title),
              message: '输入的名称不符合',
            }],
          })(
            <Input style={{ marginTop: 20 }} />
          )}
        </FormItem>
      </Form>
    );
  }
}

