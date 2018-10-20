import { isFunction, transform } from 'lodash-es'
import { merge } from 'rxjs'
import { map } from 'rxjs/operators'

import { Store, notifier } from './Store'

export function mergeNotifiers(
  injectableProviders: Record<string, Store<any, any>>,
  handlingError: (e: Error) => void
) {
  const notifiers = transform(
    injectableProviders,
    (acc, provider, key) => {
      acc.push(
        provider[notifier].pipe(
          map(updateProvider => ({
            [key]: updateProvider
          }))
        )
      )
    },
    []
  )

  return merge(notifiers)
}
