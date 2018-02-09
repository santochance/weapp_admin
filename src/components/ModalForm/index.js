import React from 'react';
import { connect } from 'dva';
import {
  Form, Input, Modal, TreeSelect, /* Button, Upload, Icon, Popconfirm */
} from 'antd';
import PicturesWall from '../PicturesWall';
import MyEditor from '../MyEditor';
import filterDeep from '../../utils/filterDeep';

const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({ sort }) => ({
  sortsTree: sort.data.treeData,
}))
class ModalForm extends React.Component {
  state = {
    // editorContent: '',
    // modalVisible: false,
  }
  updateEditorContent = (content) => {
    this.editorContent = content;
  }

  handleOk = () => {
    const { onModalOk, form } = this.props;
    if (onModalOk) {
      onModalOk(form.getFieldsValue());
    }
  }
  handleCancel = () => {
    Modal.confirm({
      title: '关闭编辑框',
      content: '正在关闭当前编辑框，未保存的内容将会丢失。确定要关闭？',
      maskClosable: true,
      cancelText: '返回编辑',
      okText: '确定关闭',
      okType: 'danger',
      onOk: () => {
        if (this.props.onModalCancel) {
          this.props.onModalCancel();
        }
      },
    });
  }
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
    // const formItemLayoutWithOutLabel = {
    //   wrapperCol: {
    //    xs: { span: 24, offset: 0 },
    //    sm: { span: 20, offset: 4 },
    //   },
    // };

    const { modalTitle, modalVisible, sortsTree,
      data: { id, locked } = {}, isLeaf = true } = this.props;
    const noSelfSortsTree = [
      {
        label: '顶级分类',
        value: '0',
        key: '0',
      },
      ...filterDeep(sortsTree, item => item.id !== id),
    ];
    return (
      <Modal
        title={modalTitle}
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        okText="保存"
        cancelText="取消"
        width={760}
      >
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          {isLeaf ? (
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator('sort', {
                // initialValue: 2,
              })(
                <TreeSelect
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={sortsTree}
                  placeholder="请选择"
                  treeDefaultExpandAll
                />
              )}
            </FormItem>
          ) : (
            <FormItem {...formItemLayout} label="父分类">
              {getFieldDecorator('pid', {
              })(
                <TreeSelect
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={noSelfSortsTree}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  disabled={locked === 'TRUE'}
                />
              )}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              // initialValue: data.title,
            })(
              <Input placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="副标题">
            {getFieldDecorator('subtitle', {
              // initialValue: data.subtitle,
            })(
              <Input placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator('desc', {
              // initialValue: data.desc,
            })(
              <TextArea placeholder="" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="内容">
            {getFieldDecorator('content', {
              // initialValue: data.content,
            })(
              <MyEditor ueditorPath="/vendor/ueditor" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="图片">{getFieldDecorator('pics', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <PicturesWall
                name="pics"
                action="https://vc-weapp.leanapp.cn/api/v1/upload"
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({
  onValuesChange: (props, values) => {
    // console.log('form values changed:', values);
    if (props.onModalDataChange) {
      const key = Object.keys(values)[0];
      props.onModalDataChange(key, values[key]);
    }
  },
  mapPropsToFields: (props) => {
    if (props.data) {
      return {
        title: Form.createFormField({ value: props.data.title }),
        subtitle: Form.createFormField({ value: props.data.subtitle }),
        desc: Form.createFormField({ value: props.data.desc }),
        sort: Form.createFormField({ value: String(props.data.sort) }),
        pid: Form.createFormField({ value: String(props.data.pid) }),
        pics: Form.createFormField({ value: props.data.pics }),
        content: Form.createFormField({ value: props.data.content }),
      };
    }
  },
})(ModalForm);
