import { merge } from 'rxjs'
import { map } from 'rxjs/operators'

import { isFunction } from './isFunction'

export function combineProviders(injectableProviders) {
  const keys = Object.keys(injectableProviders)

  for (const key of keys) {
    const provider = injectableProviders[key]
    if (
      !(
        provider &&
        provider.setState &&
        provider.setState.notifier &&
        provider.setState.notifier.next &&
        isFunction(provider.setState.notifier.next)
      )
    ) {
      console.warn(
        `${key}.setState.notifier is not a function. A provider should be a Store.`
      )
    }
  }

  return merge(
    ...keys.map(key =>
      injectableProviders[key].setState.notifier.pipe(
        map(provider => ({ [key]: provider }))
      )
    )
  )
}
