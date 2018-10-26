import { isFunction, transform } from 'lodash'

import { AnyConstructorType } from './ConstructorType'
import { Store } from './Store'

import { isVariantOf } from './isVariantOf'

export type IProviderToStoreMap = Map<
  AnyConstructorType<Store<any, any>>,
  Store<any, any>
>
export type IStoreRecord = Record<string, Store<any, any>>
export type Injectable = AnyConstructorType<Store<any, any>>

export type LazyInjectable = ((
  providers: IProviderToStoreMap
) => Injectable | void)

export type HybridInjectable = Injectable | LazyInjectable

export type InjectableRecord = Record<string, HybridInjectable>

export function loadInjectables(
  injectables: InjectableRecord = {},
  providers: IProviderToStoreMap = new Map()
): IStoreRecord {
  return transform(
    injectables,
    (injectableProviers, injectable, key) => {
      const provider = loadInjectable(injectable, providers)

      if (provider) {
        injectableProviers[key] = provider
      }
    },
    {}
  )
}

export function getInjectable(
  injectable: HybridInjectable,
  providers: IProviderToStoreMap
): void | Injectable {
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

export function loadInjectable(
  injectable: HybridInjectable,
  providers: IProviderToStoreMap
): Store<any, any> {
  const provider = getInjectable(injectable, providers)

  if (provider) {
    return providers.get(provider)
  }
}
