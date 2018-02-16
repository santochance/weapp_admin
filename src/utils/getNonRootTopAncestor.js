
function findTreeNode(_list, iteratee) {
  function recur(list) {
    let target = null;
    for (let i = 0; i < list.length; i += 1) {
      // 如果自己满足iteratee, 返回这个元素
      const item = list[i];
      if (iteratee(item, i, list)) {
        target = item;
        break;
      }
      // 否则检查是否有children
      if (item.children && item.children.length > 0) {
        target = recur(item.children);
        // 如果有满足iteratee的后代, 返回这个后代元素
        if (target) {
          break;
        }
      }
    }
    // 如果到这里target还为空，说明当前list及后代没有满足iteratee的元素
    // 返回null
    return target;
  }

  return recur(_list);
}

function getNonRootTopAncestor(flatList, _node) {
  // 往上遍历直到找到父节点是根节点的祖先节点
  function recur(node) {
    if (!node) return;
    const { pid } = node;
    if (!pid) return node;
    return recur(flatList[pid]);
  }
  return recur(_node);
}

module.exports = { findTreeNode, getNonRootTopAncestor };
