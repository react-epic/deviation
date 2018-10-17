import { noop } from 'rxjs'

import { Store, StoreLike } from './Store'
import { isFunction } from './isFunction'
import { isVariantOf } from './isVariantOf'
import { StoreMap } from './Deviation'
import { AnyConstructorType } from './ConstructorType'

export interface LazyInjectable {
  (providers: StoreMap): AnyConstructorType<StoreLike> | void
}

export type Injectable =
  | LazyInjectable
  | AnyConstructorType<StoreLike>

export type InjectableRecord = Record<string, Injectable>

export function extractProviders(
  providers: StoreMap,
  injectables: InjectableRecord
) {
  return Object.keys(injectables)
    .map(key => {
      const provider = loadInjectable(
        injectables[key],
        providers
      )
      return provider
        ? {
            [key]: providers.get(provider)
          }
        : {}
    })
    .reduce((props, next) => Object.assign(props, next), {})
}

export function loadInjectable(
  injectable: Injectable,
  providers: StoreMap
) {
  if (isFunction(injectable)) {
    if (isVariantOf<StoreLike>(injectable, Store)) {
      return injectable
    }

    /**
     * Lazy load dependency.
     */
    return injectable(providers)
  }
}
