/* UploadList组件要求传入的fileList满足`[{ url:String, uid: String }]`结构 */

export default function picFieldAdapter(pics) {
  if (pics == null) return [];
  const rst = Array.isArray(pics) ? pics : [pics];
  return rst.map((pic, idx) => {
    if (Object.prototype.toString.call(pic) !== '[object Object]') {
      return ({
        url: pic,
        uid: `${Date.now() + idx}`,
      });
    } else if (!('uid' in pic)) {
      return ({
        ...pic,
        uid: `${Date.now() + idx}`,
      });
    } else {
      return pic;
    }
  });
}
