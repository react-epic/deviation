import { isFunction, transform } from 'lodash-es'

import { AnyConstructorType } from './ConstructorType'
import { Store } from './Store'

import { isVariantOf } from './isVariantOf'

export type StoreMap = Map<
  AnyConstructorType<Store<any, any>>,
  Store<any, any>
>
export type Injectable = AnyConstructorType<Store<any, any>>

export type LazyInjectable = ((
  providers: StoreMap
) => Injectable | void)

export type HybridInjectable = Injectable | LazyInjectable

export type InjectableRecord = Record<string, HybridInjectable>

export function loadInjectables(
  injectables: InjectableRecord = {},
  providers: StoreMap = new Map()
) {
  return transform(
    injectables,
    (injectableProviers, injectable, key) => {
      const provider = loadInjectable(injectable, providers)

      if (provider) {
        injectableProviers[key] = providers.get(provider)
      }
    },
    {}
  )
}

export function loadInjectable(
  injectable: HybridInjectable,
  providers: StoreMap
) {
  if (isFunction(injectable)) {
    if (isVariantOf(injectable, Store)) {
      return injectable
    }

    /**
     * Lazy load dependency.
     */
    return injectable(providers)
  }
}
