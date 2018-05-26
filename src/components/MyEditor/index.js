import React from 'react';
import PropTypes from 'prop-types';

class MyEditor extends React.Component {
  constructor (props) {
    super(props)
    this.content = '' // 存储编译器实时数据，用于传递给父组件
    this.ueditor = null
    this.containerID = 'reactueditor' + new Date().getTime()
  }

  state = {

  }

  static propTypes = {
    value: PropTypes.string,
    ueditorPath: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  componentWillReceiveProps(nextProps) {
    // console.log('# editor will receive props: curr %s, next %s', this.props.value, nextProps.value)

    // 创建模式open或任意模式close时`props.value`为`undefined`
    // 注意props即可能是由父组件传入的，也可能是用户输入或调用`setContent()`改变了编辑器内容传入的
    if (!this.ueditor) return;

    if (nextProps.value !== this.content) {
      this.content = nextProps.value;
      // `setContent(value)`的value不能是`undefined`
      this.ueditor.setContent(nextProps.value || '');
    }
  }

  componentDidMount() {
    let { ueditorPath = "/vendor/ueditor" } = this.props
    // 引入脚本文件
    this.createScript(ueditorPath + '/ueditor.config.js').then(() => {
      this.createScript(ueditorPath + '/ueditor.all.js').then(() => {
        this.createScript(ueditorPath + '/lang/zh-cn/zh-cn.js').then(() => {
          this.initEditor()
        })
      })
    })
    window.editor = this

    // 修复当编辑器放在antd的Form.Item组件内时line-height被影响的问题
    const style = document.createElement('style');
    style.innerHTML = '.edui-default {line-height: 1.5;}';
    document.head.appendChild(style);
  }

  componentWillUnmount() {
    if (this.ueditor) {
      this.ueditor.destroy()
    }
  }

  createScript = url => {
    let scriptTags = window.document.querySelectorAll('script')
    let len = scriptTags.length
    let i = 0
    let _url = window.location.origin + url
    return new Promise((resolve, reject) => {
      for (i = 0; i < len; i++) {
        var src = scriptTags[i].src
        if (src && src === _url) {
          scriptTags[i].parentElement.removeChild(scriptTags[i])
        }
      }

      let node = document.createElement('script')
      node.src = url
      node.onload = resolve
      document.body.appendChild(node)
    })
  }

  initEditor =  () => {
    const { config, onChange, value } = this.props
    this.ueditor = window.UE.getEditor(this.containerID, Object.assign({ zIndex: 1200 }, config))
    this.ueditor.addListener('contentChange', () => {
      const nextContent = this.ueditor.getContent();
      // 在某个初始时刻`this.content`会是`undefined`
      // 这里希望把它当作是''来与`nextContent`比较，判断编辑器内容是否touched, 即是否触发过`onChange`
      const content = this.content || '';
      if (content !== nextContent) {
        this.content = nextContent;
        if (onChange) {
          onChange(nextContent);
        }
      }
    });
    this.ueditor.ready((ueditor) => {
      // ueditor.setContent()的参数不能为undefined
      // this.ueditor.setContent(this.props.value || '');
    })
  }

  render() {
    return (
      <script id={this.containerID} name={this.containerID} type="text/plain"></script>
    )
  }
}

export default MyEditor
