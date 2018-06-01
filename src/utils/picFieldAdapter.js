/* UploadList组件要求传入的fileList满足`[{ url:String, uid: String }]`结构 */

export default function picFieldAdapter(pics) {
  if (pics == null) return [];
  const photos = Array.isArray(pics) ? pics : [pics];
  const rst = [];
  photos.forEach((pic, idx) => {
    if (!pic) return;
    if (typeof pic === 'string') {
      rst.push({
        url: pic,
        uid: `${Date.now() + idx}`,
      });
    } else if (Object.prototype.toString.call(pic) === '[object Object]') {
      rst.push({
        url: pic.url,
        uid: pic.uid || `${Date.now() + idx}`,
      });
    }
  });
  return rst;
}
