import React, {useContext, useEffect, useRef} from 'react'
import CacheContext from "./CacheContext";
import * as cacheTypes from './cache-types'
import { v3 } from 'uuid'

function withKeepAlive(OldComponent, { cacheId = v3(), scroll }) {
  return function(props) {
    let { cacheStates, dispatch, mount, handleScroll } = useContext(CacheContext)
    let divRef = useRef(null);

    useEffect(() => {
      if (scroll) {
        divRef.current.addEventListener('scroll', handleScroll.bind(null, cacheId), true)
      }
    }, [handleScroll])

    useEffect(() => {
      let cacheState = cacheStates[cacheId]
      if (cacheState && cacheState.doms && cacheState.status !== cacheTypes.DESTROY) {
        let doms = cacheState.doms;
        doms.forEach(dom => divRef.current.appendChild(dom))
        if (scroll) {
          doms.forEach(dom => {
            if (cacheState.scrolls[dom]) {
              dom.scrollTop = cacheState.scrolls[dom]
            }
          })
        }
      } else {  // 如果孩子还没有，去派生吧
        mount({cacheId, reactElement: <OldComponent {...props} dispatch={dispatch} />});
      }
    }, [cacheStates, mount, props])

    return (
      <div id={`withKeepAlive-${cacheId}`} ref={divRef}>
        {/*此处需要一个 OldComponent 渲染出来的真实 DOM*/}
      </div>
    )
  }
}

export default withKeepAlive

/**
 * 本组件的核心思路是
 * 我们要通过缓存容器去创建 OldComponent 对应的真实 DOM，并且进行缓存
 * 即使这个OldComponent被销毁了，缓存还可以保留
 * 以后这个OldComponent再次渲染的时候，可以复用上次的缓存就可以了
 */