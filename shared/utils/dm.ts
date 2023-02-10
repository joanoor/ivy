import { cloneDeep } from '@ivy/core'

class DM {
  /**
   * 数组转对象
   * @param {list} obj 待转对象
   * @return {Object}
   **/
  arrayToObj<T extends Recordable = Recordable>(list: T[], key: string) {
    const data = [...list]
    const obj: Recordable = {}

    for (const item of data) {
      const tKey: string = item[key]
      obj[tKey] = item
    }
    return obj
  }

  /**
   * json数组根据key进行分类
   * @param {list} d
   * @param {String} id 分类的关键字，默认值为seriesName
   * @param {String} pid 分类的关键字，默认值为seriesName
   * @return [{id:'',children:[]}]
   **/
  changeToTree<T extends Recordable = Recordable>(
    d?: T[],
    id = 'id',
    pid = 'pid',
    ckey = 'children'
  ) {
    if (!id || !d) return []
    const key = id
    const pkey = pid
    const data = cloneDeep(d)

    const tree: T[] = []
    // 节点的id为key，存储节点，便于查找
    const map = this.arrayToObj(data, key)
    for (const v of data) {
      // 若父节点存在，且id和pid不同，放入父节点的子节点中。
      if (map[v[pkey]] && v[key] !== v[pkey]) {
        // 父节点的子节点
        if (!map[v[pkey]][ckey]) {
          map[v[pkey]][ckey] = []
        }
        // 放入子节点中
        map[v[pkey]][ckey].push(v)
      } else {
        // 否则作为根节点，根节点可能有多个。
        tree.push(v)
      }
    }
    return tree
  }
}

export const dm = new DM()
