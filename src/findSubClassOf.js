import { noop } from 'rxjs'

import { isSubClassOf } from './isSubClassOf'

export function findSubClassOf(superClass) {
  return providers => {
    if (providers.has(superClass)) {
      return superClass
    }

    for (let [provider, store] of providers) {
      if (isSubClassOf(provider, superClass)) {
        return provider
      }
    }

    return noop()
  }
}
