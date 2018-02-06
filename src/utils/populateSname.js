function populateSname(list, source) {
  const cache = {};
  // 添加sname
  return list.map((v) => {
    const sid = v.sort;
    let sname;
    if (sid in cache) {
      sname = cache[sid];
    } else {
      console.log('caculating for sort:', sid);
      sname = (source.find(s => s.id === sid) || {}).title;
      cache[sid] = sname;
    }
    return Object.assign({}, v, { sname });
  });
}

module.exports = populateSname;
