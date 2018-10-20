import { StoreMap } from './Injectable'
import { StoreInjector } from './StoreInjector'

export function createStoreExtractor() {
  class Extractor extends StoreInjector<{}> {
    static providers: StoreMap = new Map()

    static getStore(provider) {
      return this.providers.get(provider)
    }

    static getProviders() {
      return this.providers
    }

    storeDidMount() {
      Extractor.providers = this.props.providers
    }
  }

  return Extractor
}
