import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDictStore = defineStore('dict', () => {
  const dict = new Array()

  /**
   * 获取字典
   * @param _key key
   * @returns 字典值
   */
  function getDict(_key: string) {
    if (_key == null && _key == '') {
      return null
    }
    dict.forEach(item => {
      if (item.key == _key) {
        return item.value
      }
    })
  }

  /**
   * 设置字典
   * @param _key 键 
   * @param value 值
   */
  function setDict(_key: string, value: string) {
    if (_key != null && _key != '') {
      dict.push({
        key: _key,
        value
      })
    }
  }

  return { dict, getDict, setDict }
})

export default useDictStore
