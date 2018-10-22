import { AnyConstructorType } from './ConstructorType'
import { IProviderToStoreMap, Injectable } from './Injectable'
import { Store } from './Store'
import { StoreInjector } from './StoreInjector'

export interface IExtractorConstructor
  extends AnyConstructorType<StoreInjector<{}>> {
  providers: IProviderToStoreMap
  getStore?(provider: Injectable): Store<any, any>
  getProviders?(): IProviderToStoreMap
}

export function createStoreExtractor(): IExtractorConstructor {
  class Extractor extends StoreInjector<{}> {
    public static providers: IProviderToStoreMap = new Map()

    public static getStore(
      provider: Injectable
    ): Store<any, any> {
      return this.providers.get(provider)
    }

    public static getProviders(): IProviderToStoreMap {
      return this.providers
    }

    public storeDidMount(): void {
      Extractor.providers = this.props.providers
    }
  }

  return Extractor
}
