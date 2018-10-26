import { AnyConstructorType } from './ConstructorType'
import { IProviderToStoreMap } from './Injectable'
import { Store } from './Store'

export function isVariantOf<T extends AnyConstructorType<any>>(
  typeA: Function,
  typeB: T
): typeA is AnyConstructorType<InstanceType<T>> {
  return typeA.prototype instanceof typeB
}

export function findVariantOf(
  typeA: AnyConstructorType<Store<any, any>>
): ((
  providers: IProviderToStoreMap
) => AnyConstructorType<Store<any, any>>) {
  return providers => {
    for (const [provider] of providers) {
      if (isVariantOf(provider, typeA)) {
        return provider
      }
    }

    return null
  }
}
