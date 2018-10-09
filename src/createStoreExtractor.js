import { StoreInjector } from './StoreInjector'

export function createStoreExtractor() {
  class Extractor extends StoreInjector {
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

  Extractor.providers = new Map()

  return Extractor
}
