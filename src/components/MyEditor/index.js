import React from 'react'
import PropTypes from 'prop-types'

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
    // console.log('value in?:', 'value' in this.props, 'value' in nextProps)
    if ('value' in nextProps && this.props.value !== nextProps.value) {
      this.content = nextProps.value
      // 用户编辑的过程中，不会出现props.value为undefined的情况
      // 当关闭ModalForm或打开ModalForm但没传入data, 即data为undefined时，会出现props.value为undefined的情况
      if (nextProps.value === undefined || this.props.value === undefined) {
        // ueditor.setContent()参数不能为undefined
        this.ueditor.setContent(nextProps.value || '');
      }
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
      this.content = this.ueditor.getContent()
      if (onChange) {
        onChange(this.ueditor.getContent())
      }
    })
    this.ueditor.ready((ueditor) => {
      // 修复当编辑器放在antd的Form.Item组件内时line-height被影响的问题
      window.document.querySelector('.edui-default').style.lineHeight = 1.5;
      // ueditor.setContent()的参数不能为undefined
      this.ueditor.setContent(this.props.value || '');
    })
  }

  render() {
    return (
      <script id={this.containerID} name={this.containerID} type="text/plain"></script>
    )
  }
}

export default MyEditor
