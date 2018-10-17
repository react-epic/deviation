import { noop } from 'rxjs'

import { AnyConstructorType } from './ConstructorType'
import { StoreMap } from './Deviation'
import { StoreLike } from './Store'

export function isVariantOf<T>(
  typeA,
  typeB
): typeA is AnyConstructorType<T> {
  return typeA.prototype instanceof typeB
}

export function findVariantOf(
  typeA: AnyConstructorType<StoreLike>
) {
  return (
    providers: StoreMap
  ): AnyConstructorType<StoreLike> | (() => void) => {
    for (const [provider] of providers) {
      if (isVariantOf(provider, typeA)) {
        return provider
      }
    }
    return noop
  }
}
