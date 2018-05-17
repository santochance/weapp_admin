/* UploadList组件要求传入的fileList满足`[{ url:String, uid: String }]`结构 */
export default function picFieldAdapter(pics) {
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
