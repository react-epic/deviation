import { AnyConstructorType } from './ConstructorType'
import { loadInjectables } from './Injectable'
import { Store } from './Store'

export function deviateStore(
  WrappedStore: AnyConstructorType<Store<any, any>>,
  injectables,
  mergeProps
) {
  class StoreWrapper extends WrappedStore {
    static updateProviders(store, providers) {
      store.props = {...store.props,
        ...mergeProps(loadInjectables(injectables, providers), {
          providers
        })
      }
    }

    constructor(props) {
      const { providers } = props

      const injectableProviders = loadInjectables(
        providers,
        injectables
      )

      super(mergeProps(injectableProviders, props))
    }
  }

  return StoreWrapper
}
