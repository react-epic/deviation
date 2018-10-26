import { AnyConstructorType } from './ConstructorType'
import { Deviation } from './Deviation';
import { IProviderToStoreMap } from './Injectable'
import { Store } from './Store'
import { StoreInjector } from './StoreInjector'

export interface IExtractorConstructor
  extends AnyConstructorType<StoreInjector<{}>> {
  providers: IProviderToStoreMap
  getStore?<T extends AnyConstructorType<Store<any, any>>>(
    provider: T
  ): InstanceType<T>
  getProviders?(): IProviderToStoreMap
}

export function createStoreExtractor(): IExtractorConstructor {
  class Extractor extends StoreInjector<{}> {

    public static providers: IProviderToStoreMap = new Map()
    constructor(deviation: Deviation) {
      super(deviation)
    }

    public static getStore<
      T extends AnyConstructorType<Store<any, any>>
    >(provider: T): InstanceType<T> {
      return (this.providers.get(
        provider
      ) as unknown) as InstanceType<T>
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
