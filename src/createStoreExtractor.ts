import { StoreInjector } from './StoreInjector'
import { StoreLike } from './Store'
import { StoreMap } from './Deviation'

export function createStoreExtractor() {
  class Extractor extends StoreInjector<{}> {
    static providers: StoreMap = new Map()

    storeDidMount() {
      Extractor.providers = this.props.providers
    }

    static getStore(provider) {
      return this.providers.get(provider)
    }

    static getProviders() {
      return this.providers
    }
  }

  return Extractor
}
