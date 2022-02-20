import * as cacheTypes from './cache-types'

/**
 *
 * @param cacheStates 缓存状态
 * @param action 改变状态的方法
 */
function cacheReducer(cacheStates = {}, {type, payload}) {
  switch (type) {
    case cacheTypes.CREATE:
      return {
        ...cacheStates,
        [payload.cacheId]: {
          cacheId: payload.cacheId, // 缓存状态
          reactElement: payload.reactElement, // 要渲染的虚拟DOM
          doms: undefined,  // 此虚拟DOM对应的真实DOM
          status: cacheTypes.CREATE, // 缓存的状态是创建
          scrolls: {} // 滚动信息保存对象，默认为是 key 滚动的DOM， 值是滚动的位置
        }
      }
    case cacheTypes.CREATED: // 表示真实DOM已经成功创建
      return {
        ...cacheStates,
        [payload.cacheId]: {  // 一个缓存条目
          ...cacheStates[payload.cacheId],
          doms: payload.doms, // 真实DOM
          status: cacheTypes.CREATED
        }
      }
    case cacheTypes.DESTROY:
      return {
        ...cacheStates,
        [payload.cacheId]: {
          ...cacheStates[payload.cacheId],
          status: cacheTypes.DESTROY
        }
      }
    default:
      return cacheStates;
  }
}

export default cacheReducer