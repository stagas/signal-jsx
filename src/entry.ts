import { fns, hmr as jsxHmr, Off, Start } from 'jsx'
import { fx as signalfx } from 'signal'
import { isFunction, once } from 'utils'

export { mount } from 'jsx'

let jsxState: { disposables: Off[] } = { disposables: [] }

export const fx: typeof signalfx = function fx(fn: any, thisArg: any, desc?: any): any {
  if (!isFunction(fn)) return signalfx(fn, thisArg, desc)
  const dispose = once(signalfx(fn, thisArg))
  disposable(dispose)
  return dispose
}

export function cleanup() {
  jsxState.disposables.splice(0).forEach(fn => fn())
}

export function hmr(start: Start, state: Record<string, any>, replaceState: (x: Record<string, any>) => void) {
  if (!import.meta.hot) return () => { }
  return jsxHmr(start, Object.assign(state, { disposables: [] }), function (newState) {
    Object.assign(newState, { disposables: [] })
    jsxState = newState as any
    replaceState(newState)
  })
}

fns.computedAttributeFn = (el, name, fn) => {
  fx(() => {
    el.setAttribute(
      name,
      [fn()].flat().filter(Boolean).join(' ')
    )
  })
}

fns.mapItemFn = (item) => {
  if (typeof item !== 'function') return item
  const child = new Text()
  const fn = item
  fx(() => {
    const result = fn()
    child.textContent = result
  })
  return child
}

export function disposable(fn: Off) {
  jsxState.disposables.push(fn)
}
