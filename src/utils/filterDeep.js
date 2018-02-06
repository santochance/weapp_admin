function filterDeep(list, callback) {
  function recur(l) {
    return l.reduce((r, v, i, a) => {
      if (!callback(v, i, a)) return r;
      if ((v.children || []).length > 0) {
        r.push(Object.assign({}, v, { children: recur(v.children) }));
      } else {
        r.push(v);
      }
      return r;
    }, []);
  }
  return recur(list);
}

module.exports = filterDeep;
