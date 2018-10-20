import { noop } from 'rxjs'

import { AnyConstructorType } from './ConstructorType'
import { StoreMap } from './Injectable'
import { Store } from './Store'

export function isVariantOf<T extends AnyConstructorType<any>>(
  typeA,
  typeB: T
): typeA is AnyConstructorType<InstanceType<T>> {
  return typeA.prototype instanceof typeB
}

export function findVariantOf(
  typeA: AnyConstructorType<Store<any, any>>
) {
  return (
    providers: StoreMap
  ): AnyConstructorType<Store<any, any>> => {
    for (const [provider] of providers) {
      if (isVariantOf(provider, typeA)) {
        return provider
      }
    }

    return null
  }
}
