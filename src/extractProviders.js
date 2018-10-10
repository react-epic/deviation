import { Store } from './Store'
import { isFunction } from './isFunction'
import { isSubClass } from './isSubClass'

export function extractProviders(providers, injectables) {
  return Object.keys(injectables)
    .map(key => ({
      [key]: providers.get(
        loadInjectable(injectables[key], providers)
      )
    }))
    .reduce((props, next) => Object.assign(props, next), {})
}

export function loadInjectable(injectable, providers) {
  if (isFunction(injectable)) {
    if (isSubClass(injectable, Store)) {
      return injectable
    }

    /**
     * Lazy load dependency.
     */
    return injectable(providers)
  }
  return noop
}
